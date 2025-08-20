// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { retrieveContext } from "@/lib/vectorstore"; // or your own

export async function POST(req: NextRequest) {
  try {
    const { sessionId, question } = await req.json();

    if (!sessionId || !question) {
      return NextResponse.json(
        { error: "Missing sessionId or question" },
        { status: 400 }
      );
    }

    // Pull relevant context from your store
    const context = await retrieveContext(sessionId, question, 5);

    // If you want OpenAI, uncomment and add your key
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Answer using the CONTEXT below:\n" + context.map((c,i)=>`[${i+1}] ${c.text}`).join("\n\n") },
        { role: "user", content: question },
      ],
    });
    const answer = resp.choices?.[0]?.message?.content?.trim() ?? "…";

    // const answer =
    //   "No LLM configured here. Relevant snippets:\n\n" +
    //   context.map((c, i) => `[${i + 1}] ${c.text.slice(0, 300)}…`).join("\n\n");

    return NextResponse.json({ answer, sources: context });
  } catch (err: any) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
