// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseFileToText } from "@/lib/parsers";
import { indexText } from "@/lib/vectorstore";

export const runtime = "nodejs"; // pdf-parse needs Node, not Edge

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const sessionId = String(form.get("sessionId") || "");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const files = form.getAll("files") as File[];
    if (!files?.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    let added = 0;
    for (const f of files) {
      const buf = await f.arrayBuffer();
      const text = await parseFileToText(buf, f.type || "", f.name);
      const res = await indexText(sessionId, text);
      added += res.added;
    }

    return NextResponse.json({ added });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
