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

  return (
    <ClientWrapper user={user}>
      <main>{children}</main>
    </ClientWrapper>
  );
}
