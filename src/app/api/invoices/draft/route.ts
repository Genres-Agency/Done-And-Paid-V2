import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getMostRecentDraftInvoice } from "@/src/app/(protected)/dashboard/invoices/invoice.action";

export async function GET() {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the most recent draft invoice for the current user using the server action
    const draft = await getMostRecentDraftInvoice(session.user.id);

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Error fetching draft invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch draft invoice" },
      { status: 500 }
    );
  }
}
