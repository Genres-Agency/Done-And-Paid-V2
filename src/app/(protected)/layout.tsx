import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/src/app/(protected)/_components/app-sidebar";
import { BusinessTypeCheck } from "@/src/components/business-type-check";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen">
      {/* <AppSidebar /> */}
      <main className="flex-1 overflow-y-auto">
        <BusinessTypeCheck />
        {children}
      </main>
    </div>
  );
}
