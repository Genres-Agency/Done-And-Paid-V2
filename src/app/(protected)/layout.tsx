import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { currentUser } from "@/src/lib/auth";
import ClientWrapper from "./client-wrapper";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = await currentUser();

  if (!session) {
    redirect("/auth/login");
  }
  console.log("===========>>>>", user?.businessType);

  // Check if user has business type set before rendering
  if (user?.businessType && !session.user.businessType) {
    // Update session with the latest business type
    session.user.businessType = user.businessType;
  }

  return (
    <ClientWrapper user={session.user}>
      <main>{children}</main>
    </ClientWrapper>
  );
}
