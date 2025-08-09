// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in"
        afterSignUpUrl="/chat"  // Add this
        afterSignInUrl="/chat"  // Add this
      />
    </div>
  );
}
