// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";

// function sid(): string {
//   if (typeof window === "undefined") return "server";
//   let s = localStorage.getItem("sid");
//   if (!s) {
//     s = crypto.randomUUID();
//     localStorage.setItem("sid", s);
//   }
//   return s;
// }

// export default function Home() {
//   const sessionId = useMemo(sid, []);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const [textSource, setTextSource] = useState("");
//   const [urlSource, setUrlSource] = useState("");
//   const [chatQ, setChatQ] = useState("");
//   const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
//   const [busy, setBusy] = useState(false);
//   const [indexedCount, setIndexedCount] = useState(0);

// async function postJSON(url: string, body: any) {
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   let data: any = null;
//   try { data = await res.json(); } catch { /* HTML error page, etc. */ }
//   if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
//   return data;
// }


//   async function onIndexText() {
//     if (!textSource.trim()) return;
//     setBusy(true);
//     const res = await postJSON("/api/index-text", { sessionId, text: textSource });
//     setIndexedCount(c => c + (res.added || 0));
//     setBusy(false);
//   }

//   async function onIndexUrl() {
//     if (!urlSource.trim()) return;
//     setBusy(true);
//     const res = await postJSON("/api/index-url", { sessionId, url: urlSource });
//     setIndexedCount(c => c + (res.added || 0));
//     setBusy(false);
//   }

// // inside onUploadFiles
// async function onUploadFiles(files: FileList | null) {
//   if (!files || files.length === 0) return;
//   const fd = new FormData();
//   fd.append("sessionId", sessionId);
//   Array.from(files).forEach(f => fd.append("files", f));
//   setBusy(true);
//   const res = await fetch("/api/upload", { method: "POST", body: fd });
//   let data: any = null;
//   try { data = await res.json(); } catch {}
//   setBusy(false);

//   if (!res.ok) {
//     alert(data?.error || "Upload failed");
//     return;
//   }
//   setIndexedCount(c => c + (data.added || 0));
// }


//   async function onAsk() {
//     if (!chatQ.trim()) return;
//     const q = chatQ.trim();
//     setChatQ("");
//     setChat(prev => [...prev, { role: "user", content: q }]);
//     setBusy(true);
//     const res = await postJSON("/api/chat", { sessionId, question: q });
//     setChat(prev => [...prev, { role: "assistant", content: res.answer }]);
//     setBusy(false);
//   }

//   useEffect(() => {
//     // just to show initial state
//   }, []);

//   return (
//     <main className="min-h-screen p-6 max-w-5xl mx-auto space-y-8">
//       <h1 className="text-2xl font-semibold">RAG Starter (Text / File / Website)</h1>

//       {/* Data Source: Text */}
//       <section className="space-y-2 border p-4 rounded">
//         <h2 className="font-medium">Data Source: Text</h2>
//         <textarea
//           className="w-full border rounded p-2 min-h-[120px]"
//           placeholder="Paste text here..."
//           value={textSource}
//           onChange={e => setTextSource(e.target.value)}
//         />
//         <button
//           className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
//           onClick={onIndexText}
//           disabled={busy || !textSource.trim()}
//         >
//           Index Text
//         </button>
//       </section>

//       {/* Data Source: File Upload */}
//       <section className="space-y-2 border p-4 rounded">
//         <h2 className="font-medium">Data Source: File Upload (PDF, CSV, TXT)</h2>
//         <input ref={fileRef} type="file" multiple onChange={e => onUploadFiles(e.target.files)} />
//       </section>

//       {/* Data Source: Website */}
//       <section className="space-y-2 border p-4 rounded">
//         <h2 className="font-medium">Data Source: Website URL</h2>
//         <input
//           className="w-full border rounded p-2"
//           placeholder="https://example.com/article"
//           value={urlSource}
//           onChange={e => setUrlSource(e.target.value)}
//         />
//         <button
//           className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
//           onClick={onIndexUrl}
//           disabled={busy || !urlSource.trim()}
//         >
//           Index URL
//         </button>
//       </section>

//       {/* RAG Store indicator */}
//       <section className="space-y-2 border p-4 rounded">
//         <h2 className="font-medium">RAG Store</h2>
//         <p className="text-sm text-gray-600">
//           Chunks indexed this session: <b>{indexedCount}</b>
//         </p>
//       </section>

//       {/* Chat */}
//       <section className="space-y-2 border p-4 rounded">
//         <h2 className="font-medium">Chat</h2>
//         <div className="space-y-3 max-h-[300px] overflow-auto border rounded p-3 bg-gray-50">
//           {chat.map((m, i) => (
//             <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
//               <span className={`inline-block px-3 py-2 rounded ${m.role === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}>
//                 {m.content}
//               </span>
//             </div>
//           ))}
//           {busy && <div className="text-sm text-gray-500">…thinking…</div>}
//         </div>
//         <div className="flex gap-2">
//           <input
//             className="flex-1 border rounded p-2"
//             placeholder="Ask a question about your indexed data…"
//             value={chatQ}
//             onChange={e => setChatQ(e.target.value)}
//             onKeyDown={e => e.key === "Enter" && onAsk()}
//           />
//           <button className="px-3 py-2 rounded bg-black text-white disabled:opacity-50" onClick={onAsk} disabled={busy || !chatQ.trim()}>
//             Send
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// }




"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function sid(): string {
  if (typeof window === "undefined") return "server";
  let s = localStorage.getItem("sid");
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem("sid", s);
  }
  return s;
}

export default function Home() {
  const sessionId = useMemo(sid, []);
  const fileRef = useRef<HTMLInputElement>(null);

  const [textSource, setTextSource] = useState("");
  const [urlSource, setUrlSource] = useState("");
  const [chatQ, setChatQ] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [indexedCount, setIndexedCount] = useState(0);

  async function postJSON(url: string, body: any) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  }

  async function onIndexText() {
    if (!textSource.trim()) return;
    setBusy(true);
    const res = await postJSON("/api/index-text", { sessionId, text: textSource });
    setIndexedCount((c) => c + (res.added || 0));
    setBusy(false);
  }

  async function onIndexUrl() {
    if (!urlSource.trim()) return;
    setBusy(true);
    const res = await postJSON("/api/index-url", { sessionId, url: urlSource });
    setIndexedCount((c) => c + (res.added || 0));
    setBusy(false);
  }

  async function onUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    fd.append("sessionId", sessionId);
    Array.from(files).forEach((f) => fd.append("files", f));
    setBusy(true);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    let data: any = null;
    try {
      data = await res.json();
    } catch {}
    setBusy(false);

    if (!res.ok) {
      alert(data?.error || "Upload failed");
      return;
    }
    setIndexedCount((c) => c + (data.added || 0));
  }

  async function onAsk() {
    if (!chatQ.trim()) return;
    const q = chatQ.trim();
    setChatQ("");
    setChat((prev) => [...prev, { role: "user", content: q }]);
    setBusy(true);
    const res = await postJSON("/api/chat", { sessionId, question: q });
    setChat((prev) => [...prev, { role: "assistant", content: res.answer }]);
    setBusy(false);
  }

  useEffect(() => {}, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur border-b bg-white/70">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">RAG Starter</h1>
            <p className="text-sm text-slate-500">Text • Files • Website</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Session: <b>{sessionId.slice(0, 8)}</b>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Indexed: <b>{indexedCount}</b>
            </span>
          </div>
        </div>
        {busy && (
          <div className="h-1 w-full overflow-hidden bg-slate-200">
            <div className="h-full w-1/3 animate-[loading_1.2s_ease_infinite] bg-black" />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-5 py-8 grid lg:grid-cols-2 gap-6">
        {/* Left column: Inputs */}
        <div className="space-y-6">
          {/* Card: Text Source */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center text-sm">T</div>
              <h2 className="font-medium">Data Source: Text</h2>
            </div>
            <div className="p-5 space-y-3">
              <textarea
                className="w-full rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200 p-3 min-h-[140px] placeholder:text-slate-400"
                placeholder="Paste text here…"
                value={textSource}
                onChange={(e) => setTextSource(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onIndexText}
                  disabled={busy || !textSource.trim()}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M3 12h11.59l-4.3-4.29L12 6l6 6-6 6-1.71-1.71 4.3-4.29H3z"/></svg>
                  Index Text
                </button>
              </div>
            </div>
          </section>

          {/* Card: File Upload */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center text-sm">F</div>
              <h2 className="font-medium">Data Source: File Upload</h2>
            </div>
            <div className="p-5">
              {/* Dropzone */}
              <div
                className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-10 text-center hover:border-slate-400 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onUploadFiles(e.dataTransfer.files);
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => onUploadFiles(e.target.files)}
                />
                <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-white border grid place-items-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-700">
                    <path d="M19 15v4H5v-4H3v6h18v-6zM11 3h2v9h3l-4 4-4-4h3z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">
                  Drag & drop PDF, CSV, TXT here, or{" "}
                  <button
                    type="button"
                    className="text-slate-900 underline underline-offset-2"
                    onClick={() => fileRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
              </div>
            </div>
          </section>

          {/* Card: Website URL */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center text-sm">W</div>
              <h2 className="font-medium">Data Source: Website URL</h2>
            </div>
            <div className="p-5 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200 p-3 placeholder:text-slate-400"
                placeholder="https://example.com/article"
                value={urlSource}
                onChange={(e) => setUrlSource(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onIndexUrl}
                  disabled={busy || !urlSource.trim()}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M3 12h11.59l-4.3-4.29L12 6l6 6-6 6-1.71-1.71 4.3-4.29H3z"/></svg>
                  Index URL
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: Chat */}
        <section className="rounded-2xl border bg-white shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center text-sm">💬</div>
              <h2 className="font-medium">Chat</h2>
            </div>
            <span className="text-xs text-slate-500">Ask about your indexed data</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-auto space-y-3 bg-slate-50">
            {chat.length === 0 && (
              <div className="text-center text-sm text-slate-500 py-16">
                Start by indexing text, files, or a URL — then ask a question here.
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    m.role === "user" ? "bg-slate-900 text-white" : "bg-white border"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && <div className="text-xs text-slate-500">…thinking…</div>}
          </div>

          {/* Composer */}
          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-200 p-3 text-sm"
                placeholder="Ask a question about your indexed data…"
                value={chatQ}
                onChange={(e) => setChatQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAsk()}
              />
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onAsk}
                disabled={busy || !chatQ.trim()}
                aria-label="Send"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
                Send
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </main>
  );
}
