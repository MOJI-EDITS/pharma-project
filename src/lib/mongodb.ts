import dns from 'dns';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

function ensureFallbackDns() {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch {
    // ignore DNS configuration failures and fall back to system resolver
  }
}

ensureFallbackDns();

function isValidMongoUri(uri: string) {
  return /^mongodb(?:\+srv)?:\/\/\S+$/.test(uri);
}

function getMongoUri() {
  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local. Example: mongodb+srv://user:pass@cluster0.example.net/mydb?retryWrites=true&w=majority');
  }
  if (!isValidMongoUri(MONGODB_URI)) {
    throw new Error('Invalid MONGODB_URI in .env.local. Ensure the URI is a valid MongoDB connection string.');
  }

  return MONGODB_URI;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // @ts-expect-error - Type issue with mongoose connect options
cached.promise = mongoose.connect(getMongoUri(), opts).then((mg) => mg);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;