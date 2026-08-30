import { MongoClient, Db } from 'mongodb';

// Cached client + db (mirrors the Upstash env-configured-client precedent in
// app/api/chat/route.ts: build once, reuse, fail loud on missing env instead
// of silently constructing a broken client). Also cached on `global` so Next's
// dev-mode module reloads don't open a new connection per edit.

let client: MongoClient | null = null;
let db: Db | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

export async function getMongoDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  if (globalThis._mongoClient) {
    client = globalThis._mongoClient;
  } else {
    client = new MongoClient(uri);
    await client.connect();
    globalThis._mongoClient = client;
  }

  db = client.db();
  return db;
}
