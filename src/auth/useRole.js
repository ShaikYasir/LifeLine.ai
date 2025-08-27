import { useUser } from "@clerk/clerk-react";

export function useRole() {
  const { isSignedIn, user } = useUser();
  const role =
    user?.publicMetadata?.role || user?.unsafeMetadata?.role || "User";
  return { isSignedIn, role };
}
