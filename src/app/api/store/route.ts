import { NextResponse } from "next/server";
import { db } from "@/src/lib/database.connection";

export async function GET() {
  try {
    const store = await db.store.findFirst();

    if (!store) {
      return NextResponse.json({ store: null });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Failed to fetch store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store data" },
      { status: 500 }
    );
  }
}
