import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex justify-center py-10">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
}
