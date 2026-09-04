// app/api/checkins/route.ts
import { NextRequest, NextResponse } from "next/server";
import { markTempleVisited } from "@/lib/passport";

export async function POST(req: NextRequest) {
  try {
    const { templeId } = await req.json();
    if (!templeId) {
      return NextResponse.json({ error: "templeId is required" }, { status: 400 });
    }
    await markTempleVisited(templeId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err.message === "Not authenticated" ? 401 : 500;
    return NextResponse.json({ error: err.message ?? "Failed to check in" }, { status });
  }
}
