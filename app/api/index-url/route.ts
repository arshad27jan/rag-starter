import { NextRequest, NextResponse } from "next/server";
import { fetchWebsiteText } from "@/lib/parsers";
import { indexText } from "@/lib/vectorstore";

export const runtime = "nodejs"; // safe default

export async function POST(req: NextRequest) {
  try {
    const { sessionId, url } = await req.json();
    if (!sessionId || !url) {
      return NextResponse.json({ error: "Missing sessionId or url" }, { status: 400 });
    }
    const text = await fetchWebsiteText(url);
    const res = await indexText(sessionId, text);
    return NextResponse.json({ added: res.added });
  } catch (err: any) {
    console.error("Index URL error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
