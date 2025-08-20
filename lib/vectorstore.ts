// lib/vectorstore.ts
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

type StoreMap = Map<string, MemoryVectorStore>;
const globalForStore = global as unknown as { __stores?: StoreMap };
const stores: StoreMap = globalForStore.__stores ?? new Map();
if (!globalForStore.__stores) globalForStore.__stores = stores;

export async function getStore(sessionId: string) {
  let store = stores.get(sessionId);
  if (!store) {
    store = new MemoryVectorStore(new OpenAIEmbeddings({}));
    stores.set(sessionId, store);
  }
  return store;
}

export async function retrieveContext(sessionId: string, query: string, n = 5) {
  const store = await getStore(sessionId);
  const results = await store.similaritySearch(query, n);
  return results.map((doc) => ({ text: doc.pageContent, metadata: doc.metadata }));
}

export async function indexText(sessionId: string, text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 120,
  });
  const docs = await splitter.createDocuments([text]);
  const store = await getStore(sessionId);
  await store.addDocuments(docs);
  return { added: docs.length };
}
