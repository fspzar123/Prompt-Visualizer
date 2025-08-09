import os
import re
from openai import AzureOpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from sentence_transformers import SentenceTransformer
import psycopg2
import numpy as np
import json
import time
import numpy as np

from dotenv import load_dotenv
load_dotenv()


AZURE_MODEL_ENDPOINTS = {
    "azure/gpt-4.1-mini": "https://pacsbot-standby-apis.openai.azure.com/openai/deployments/gpt-4.1-mini/chat/completions?api-version=2025-01-01-preview",
    "azure/gpt-4o-mini": "https://pacsbot-standby-apis.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
    "azure/gpt-4.1-nano": "https://pacsbot-standby-apis.openai.azure.com/openai/deployments/gpt-4.1-nano/chat/completions?api-version=2025-01-01-preview"
}


def get_pg_connection():
    return psycopg2.connect(
        host=os.environ.get("POSTGRES_HOST"),
        port=os.environ.get("POSTGRES_PORT"),
        dbname=os.environ.get("POSTGRES_DB"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"),
    )


client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ["AZURE_OPENAI_API_VERSION"],
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"]
)


def extract_product_and_version(collection_name):
    # 1) Strict prefix‐match for "temenos_" or "None_"
    m = re.match(
        r'^(?:temenos|None)_'
        r'([A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)'       # product (allow letters, digits, underscores & hyphens)
        r'_([rR]?\d+(?:\.\d+)?)$',                   # version (optional 'r', digits, optional .digits)
        collection_name
    )
    if m:
        prod, ver = m.group(1).lower(), m.group(2).lower()
        if prod == 'none' or ver == 'none':
            return None, None
        if not ver.startswith('r'):
            ver = 'r' + ver
        return prod, ver

    # 2) Fallback split-by-underscore (for things like "None_transact_r23")
    parts = collection_name.split('_')
    if len(parts) >= 3:
        prod, ver = parts[1].lower(), parts[2].lower()
        # sanity checks
        if (prod and prod != 'none'
            and ver != 'none'
            and re.fullmatch(r'[rR]?\d+(?:\.\d+)?', ver)
        ):
            if not ver.startswith('r'):
                ver = 'r' + ver
            return prod, ver

    return None, None

def replace_abbreviations(text):
    abbreviation_map = {
        "COB": "Close of Business",
        "AA": "Arrangement Architecture",
        "MM": "Money Market",
        "FX": "Foreign Exchange",
        "SW": "SWAP",
        "LC": "Letter of Credit",
        "MD": "Miscellaneous Deals"
    }

    def replacer(match):
        abbr = match.group(0).upper()
        return abbreviation_map.get(abbr, abbr)

    # Create a regex pattern like: \b(COB|AA|MM|FX|SW|LC|MD)\b
    pattern = r'\b(' + '|'.join(re.escape(k) for k in abbreviation_map.keys()) + r')\b'
    return re.sub(pattern, replacer, text, flags=re.IGNORECASE)


### ---- Embedding Function ---- ###
def azure_openai_embed(texts):
    api_key = os.environ["AZURE_OPENAI_API_KEY"]
    endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
    deployment = os.environ["AZURE_OPENAI_EMBEDDING_DEPLOYMENT"]
    url = f"{endpoint}openai/deployments/{deployment}/embeddings?api-version=2024-02-15-preview"

    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }
    data = {"input": texts}
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return [item["embedding"] for item in response.json()["data"]]


def embed_text(text):
    return azure_openai_embed([text])[0]


def previous_version(version):
    """
    Given a product and version, return the previous version.
    If the version is 'r23', return 'r22'.
    If the version is 'r24', return 'r23'.
    """
    if not version:
        return None

    match = re.match(r'^(r)(\d+)$', version, re.IGNORECASE)
    if match:
        prefix, num = match.groups()
        prev_num = int(num) - 1
        return f"{prefix}{prev_num}"
    
    return None

def search_postgres(query, product=None, version=None, history=None, top_k=20, max_tokens=3500):
    conn = get_pg_connection()
    cur = conn.cursor()
    # Replace abbreviations in the query
    expanded_query = replace_abbreviations(query)
    print(f"Expanded query: {expanded_query}")
    query_embedding = embed_text(expanded_query)

    if product and version:
        collection_name = f"temenos_{product}_{version}"
        cur.execute("""
            SELECT e.document, c.name, e.embedding <=> %s::vector AS distance
            FROM langchain_pg_embedding e
            JOIN langchain_pg_collection c ON e.collection_id = c.uuid
            WHERE c.name = %s
            ORDER BY e.embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, collection_name, query_embedding, top_k))
    else:
        cur.execute("""
            SELECT e.document, c.name, e.embedding <=> %s::vector AS distance
            FROM langchain_pg_embedding e
            JOIN langchain_pg_collection c ON e.collection_id = c.uuid
            ORDER BY e.embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, query_embedding, top_k))
    results = cur.fetchall()
    cur.close()
    conn.close()
    context_files = []
    for doc, collection_name, distance in results:
        similarity = round(1 - float(distance), 4)
        if similarity > 0.3:
            context_files.append({
                "document": doc,
                "collection_name": collection_name,
                "similarity": similarity
            })
    return context_files


def call_chat_api(prompt, model, retries=3):
    if model in AZURE_MODEL_ENDPOINTS:
        url = AZURE_MODEL_ENDPOINTS[model]
        headers = {
            "api-key": os.environ.get("AZURE_OPENAI_API_KEY", ""),
            "Content-Type": "application/json"
        }
        data = {"messages": [{"role": "user", "content": prompt}]}
        for attempt in range(retries):
            try:
                resp = requests.post(url, headers=headers, json=data, timeout=30)
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    return f"[API Error] {str(e)}"
    else:
        return "contact backend error"
    


def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return float(np.dot(a, b) / denom) if denom else 0.0

def split_into_sentences(text):
    blocks = re.split(r'\n\s*\n', text.strip())
    if len(blocks) > 1:
        return [b.strip() for b in blocks if b.strip()]
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text.strip()) if s.strip()]

def normalize_text(s):
    return re.sub(r'\s+', ' ', s.strip().lower())

def split_into_chunks(text):
    sentences = split_into_sentences(text)
    lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
    all_chunks = list({*sentences, *lines})
    all_chunks.append(text.strip())
    return all_chunks

def format_prompt(versions_with_text):
    return '\n\n'.join([f"Version {v['version']}:\n{v['content']}" for v in versions_with_text])

app = Flask(__name__)
CORS(app)


@app.route("/api/suggestions", methods=['POST'])
def get_suggestions():
    data = request.json
    input_query = data.get("query", "").strip()
    context_chats = data.get("context", [])
    product = data.get("product")
    version = data.get("version")
    history = data.get("history", [])  # List of {"role": "user"/"bot", "content": "..."}

    if not input_query:
        return jsonify({"suggestions": []})

    # Optional: also search most relevant documents
    top_context_docs = search_postgres(input_query, history, product, version)[:3]

    docs_context = "\n\n".join(f"- {doc['document']}" for doc in top_context_docs)
    chat_context = "\n".join([f"{c}" for c in context_chats[-3:]])

    # Dynamic instruction to LLM
    suggestion_prompt = f"""You are an assistant helping users write better prompts for an AI banking assistant.

They are currently typing: "{input_query}"

Recent conversation context:
{chat_context or "None"}

Relevant documentation context:
{docs_context or "None"}

Your task:
- Analyze the user's query and provide 5 possible questions they might want to ask.
- Include variations: corrections, completions, or focused rephrasing.
- If there are typos in the query, correct them.
- If the query is too vague, make specific follow-ups.
- If the query is already good, make minor improvements.
- Format the questions to be more specific, clear, and actionable.

Suggestions (write one per line):
"""

    suggestions_text = call_chat_api(suggestion_prompt, model="azure/gpt-4.1-nano")
    suggestions = [line.strip() for line in suggestions_text.strip().split("\n") if line.strip()][:5]

    return jsonify({"suggestions": suggestions})



@app.route('/api/test-docs', methods=['GET'])
def test_docs():
    query = 'How i can create a script for the following: Any one asset in non EUR currency =< 10%?'
    query_embedding = embed_text(query)
    conn = get_pg_connection()
    cur = conn.cursor()
    # Use a parameter for the collection name pattern
    collection_pattern = 'temenos_transact_r21%'
    cur.execute("""
        SELECT c.name, e.collection_id, e.document
        FROM langchain_pg_embedding e
        JOIN langchain_pg_collection c ON e.collection_id = c.uuid
        WHERE c.name LIKE %s
        ORDER BY e.embedding <=> %s::vector
        LIMIT 10
    """, (collection_pattern, query_embedding))
    results = cur.fetchall()
    cur.close()
    conn.close()
    docs = [{"document": row[2], "collection_name": row[0]} for row in results]
    return jsonify(docs)


@app.route('/api/products', methods=['GET'])
def list_products():
    conn = get_pg_connection()
    cur = conn.cursor()
    cur.execute("SELECT name FROM langchain_pg_collection")
    names = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    products = {}
    for name in names:
        product, version = extract_product_and_version(name)
        if product:
            products.setdefault(product, set()).add(version)
    # Convert sets to sorted lists
    products = {k: sorted(list(v)) for k, v in products.items()}
    return jsonify(products)

@app.route('/api/context', methods=['POST'])
def get_context_for_product_version():
    data = request.json
    product = data.get('product')
    version = data.get('version')
    if not product or not version:
        return jsonify({"error": "Product and version required"}), 400
    collection_name = f"temenos_{product}_{version}"
    conn = get_pg_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT c.name, e.collection_id, e.document
        FROM langchain_pg_embedding e
        JOIN langchain_pg_collection c ON e.collection_id = c.uuid
        WHERE c.name LIKE %s
        LIMIT 10
    """, (collection_name,))
    results = cur.fetchall()
    cur.close()
    conn.close()
    context_files = [{"document": row[0], "collection_name": row[1]} for row in results]
    return jsonify(context_files)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_query = data.get('prompt', '')
    history = data.get('history', [])  # List of {"role": "user"/"bot", "content": "..."}
    model = data.get('model', 'azure/gpt-4.1-mini')
    product = data.get('product')
    version = data.get('version')

    # Format conversation history
    history_str = ""
    for turn in history:
        if turn["role"] == "user":
            history_str += f"User: {turn['content']}\n"
        else:
            history_str += f"Bot: {turn['content']}\n"

    # Search context (semantic + filtered)
    context_blocks = search_postgres(user_query, product, version, history)
    context_str = "\n\n".join(
        f"Collection: {block['collection_name']}\nDocument:\n{block['document']}"
        for block in context_blocks
    )

    # System prompt
    default_system_instructions = f"""You are a highly knowledgeable assistant for Temenos banking products.

You will be given:
- A conversation history between the user and assistant, which may contain follow-up questions, references, or pronouns.
- Context blocks from official documentation. Each block contains section headers marked as h1:, h2:, etc., followed by the content from that section.

Instructions:
- Carefully read the h1:, h2:, and other header markers to understand the topic and subtopic of each context block.
- Use the information under these headers to answer the user's question as accurately as possible.
- If the answer requires information from multiple sections, synthesize a complete answer using all relevant blocks.
- When possible, cite the h1:/h2: section titles in your answer to help the user understand where the information comes from.
- Look for the following abbreviations in the context:
    -"COB" for "Close of Business"
    -"AA" for "Arrangement Architecture"
    -"MM" for "Money Market"
    -"FX" for "Foreign Exchange"
    -"SW" for "SWAP"
    -"LC" for "Letter of Credit"
    -"MD" for "Miscellaneous Deals"
- If there are typos in the query provided to you try to provide the correct word and ask them for clarification before answering.
- If the context does not contain enough information, reply: "Not enough context provided."
- Do not speculate or use external information.
- Provide clear, structured answers, using examples, pseudocode, or markdown if applicable.

Always base your answer on the provided context.
You are currently helping with product: {product} and version: {version}.
Mention the product and version in your answer."""

    # Override if user sent edited system_instructions
    system_instructions = data.get('system_instructions', default_system_instructions)
 
    full_prompt = (
        f"{system_instructions}\n\n"
        f"--- CONVERSATION HISTORY ---\n{history_str}\n"
        f"--- CONTEXT ---\n{context_str}\n\n"
        f"--- QUESTION ---\n{user_query}"
    )

    answer = call_chat_api(full_prompt, model=model)

    return jsonify({
        "response": answer,
        "context_files": context_blocks,
        "llm_prompt": full_prompt
    })

@app.route('/api/compare', methods=['POST'])
def compare_answers():
    """
    Receives: {
        "question": "original question",
        "answers": [answer1, answer2, answer3],
        "models": [model1, model2, model3]
    }
    Returns: { "best": "the best answer as chosen by the LLM" }
    """
    data = request.json
    question = data.get('question', '')
    answers = data.get('answers', [])
    models = data.get('models', [])

    # Compose a prompt to let the LLM choose the best answer
    prompt = (
        f"You are an impartial expert evaluator. Your task is to select the best answer to the following question, based solely on accuracy, completeness, and clarity.\n\n"
        f"Question: \"{question}\"\n\n"
        f"Here are three answers from different AI models:\n"
        f"1. {models[0]}: {answers[0]}\n"
        f"2. {models[1]}: {answers[1]}\n"
        f"3. {models[2]}: {answers[2]}\n\n"
        "Instructions:\n"
        "- Do not be influenced by the model names or writing style.\n"
        "- Compare the answers for semantic accuracy, factual correctness, and how well they address the question.\n"
        "- Select the answer that is most accurate, complete, and helpful.\n"
        "- Do not favor answers that simply repeat the question or are overly verbose.\n"
        "- Do not provide any explanation or commentary—just output the best answer verbatim.\n\n"
        "Best Answer:"
    )
    
    # Use Azure model for comparison
    best = call_chat_api(prompt, model="azure/gpt-4.1-mini")
    return jsonify({'best': best})



@app.route('/api/send-versions', methods=['POST','GET'])
def send_versions():
    data = request.json
    product = data.get('product', '')
    version1 = data.get('version1', '')
    version2 = previous_version(version1)
    version3 = previous_version(version2)
    versions = [version1, version2, version3] 

    # Here you would typically process the versions, e.g., save to a database or perform some action
    print(f"Received version: {version1}")
    print(f"Sent versions: {versions}")
    # For now, just return them back
    return jsonify({"received_versions": versions})

@app.route('/api/compare-version', methods=['POST'])
def compare_version_answers():
    data = request.json
    question = data.get('question', '')
    answers = data.get('answers', [])
    versions = data.get('versions', [])

    prompt = (
        f"You are an impartial expert evaluator. Your task is to select the best answer to the following question, based solely on accuracy, completeness, and clarity.\n\n"
        f"Question: \"{question}\"\n\n"
        f"Here are answers for different product versions:\n"
        + "\n".join([f"{i+1}. {versions[i]}: {answers[i]}" for i in range(len(answers))]) +
        "\n\nInstructions:\n"
        "- Compare the answers for semantic accuracy, factual correctness, and how well they address the question.\n"
        "- Select the answer that is most accurate, complete, and helpful.\n"
        "- Do not provide any explanation or commentary—just output the best answer verbatim.\n\n"
        "Best Answer:"
    )
    best = call_chat_api(prompt, model="azure/gpt-4.1-mini")
    return jsonify({'best': best})


@app.route('/api/semantic-llm-diff', methods=['POST'])
def semantic_llm_diff():
    data = request.json
    SIMILARITY_THRESHOLD = 0.90
    versions = data.get('versions', [])
    answers = data.get('answers', [])
    if not versions or not answers:
        return jsonify({"error": "Missing 'versions' or 'answers' in request"}), 400
    if len(versions) != len(answers):
        return jsonify({"error": "Version and answer lengths mismatch"}), 400

    try:
        # Step 1: Split each answer into chunks
        all_versions_chunks = [split_into_chunks(ans) for ans in answers]

        # Step 2: Embed all chunks of all answers
        # We flatten for batch embedding, keeping track of indices
        flattened_chunks = []
        chunk_map = []  # list of (version_idx, chunk_text)
        for v_idx, chunks in enumerate(all_versions_chunks):
            for chunk in chunks:
                normalized_chunk = normalize_text(chunk)
                flattened_chunks.append(normalized_chunk)
                chunk_map.append((v_idx, chunk))  # keep original text

        # Step 3: Get embeddings for all chunks at once
        # (Assuming embed_text supports batching, else batch call or loop)
        embeddings = azure_openai_embed(flattened_chunks)  # returns list of vectors

        # Step 4: Organize embeddings per version
        per_version_embeddings = [[] for _ in versions]
        per_version_chunks = [[] for _ in versions]

        for i, (v_idx, chunk_text) in enumerate(chunk_map):
            per_version_embeddings[v_idx].append(embeddings[i])
            per_version_chunks[v_idx].append(chunk_text)

        # Step 5: Compare each chunk embedding to chunks in *other* versions to find uniqueness
        highlights = []
        for v_idx, (chunks, embds) in enumerate(zip(per_version_chunks, per_version_embeddings)):
            unique_chunks = []
            for i, (chunk, emb) in enumerate(zip(chunks, embds)):
                # Compare this chunk embedding against all chunks in other versions
                similarities = []
                for other_v_idx, other_embds in enumerate(per_version_embeddings):
                    if other_v_idx == v_idx:
                        continue
                    # Compute cosine similarities against this chunk and all chunks in other version
                    sims = [cosine_similarity(emb, o_emb) for o_emb in other_embds]
                    similarities.extend(sims)

                # Determine if this chunk is unique 
                # (no other chunk in other versions is too similar, i.e. max similarity < threshold)
                max_sim = max(similarities) if similarities else 0.0
                is_unique = max_sim < SIMILARITY_THRESHOLD
                if is_unique:
                    unique_chunks.append({
                        "text": chunk,
                        "is_unique": True,
                    })

            highlights.append({
                "version": versions[v_idx],
                "chunks": unique_chunks,
            })

        return jsonify({"highlights": highlights})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Make sure you set AZURE_OPENAI_API_KEY in your environment before running!
    app.run(port=5000, debug=True)