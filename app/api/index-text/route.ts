// app/api/index-text/route.ts
import { NextRequest, NextResponse } from "next/server";
import { indexText } from "@/lib/vectorstore";

export async function POST(req: NextRequest) {
  const { sessionId, text } = await req.json();
  if (!sessionId || !text) return NextResponse.json({ error: "Missing sessionId or text" }, { status: 400 });

  const result = await indexText(sessionId, text);
  return NextResponse.json(result);
}
