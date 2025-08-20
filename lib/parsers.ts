// lib/parsers.ts
import Papa from "papaparse";
import * as cheerio from "cheerio";

export async function parseFileToText(
  file: ArrayBuffer,
  mime: string,
  filename?: string
) {
  const buf = Buffer.from(file);
  const ext = (filename || "").toLowerCase();

  if (mime.includes("pdf") || ext.endsWith(".pdf")) {
    // Lazy import so it only loads on the server, avoids Edge/runtime bundling issues
    const { default: pdfParse } = await import("pdf-parse");
    const out = await pdfParse(buf);
    return out.text;
  }

  if (mime.includes("csv") || ext.endsWith(".csv")) {
    const text = new TextDecoder().decode(buf);
    const parsed = Papa.parse<string[]>(text.trim(), { skipEmptyLines: true });
    return parsed.data.map(row => row.join(" ")).join("\n");
  }

  // default to plain text
  return new TextDecoder().decode(buf);
}

export async function fetchWebsiteText(url: string) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script,style,noscript").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}
