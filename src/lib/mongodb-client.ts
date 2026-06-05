import dns from 'dns';
import { MongoClient } from "mongodb";

const options = {};

function ensureFallbackDns() {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch {
    // ignore DNS configuration failures and fall back to system resolver
  }
}

ensureFallbackDns();

let client;

let clientPromise: Promise<MongoClient>;

function isValidMongoUri(uri: string) {
  return /^mongodb(?:\+srv)?:\/\/\S+$/.test(uri);
}

export default function getClientPromise() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local. Example: mongodb+srv://user:pass@cluster0.example.net/mydb?retryWrites=true&w=majority');
  }

  if (!isValidMongoUri(uri)) {
    throw new Error('Invalid MONGODB_URI in .env.local. Ensure the URI is a valid MongoDB connection string.');
  }

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}
