import { currentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }
  return redirect("/dashboard/overview");
}
