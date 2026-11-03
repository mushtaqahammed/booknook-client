import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

/**
 * Next.js dev server re-evaluates this module on every edit (HMR), which
 * would normally create a new MongoClient each time. Caching it on globalThis
 * keeps one connection for the lifetime of the server process.
 */
const globalForAuth = globalThis as unknown as {
  bookNookMongoClient?: MongoClient;
};

const getMongoClient = () => {
  if (!globalForAuth.bookNookMongoClient) {
    globalForAuth.bookNookMongoClient = new MongoClient(
      process.env.MONGODB_URL as string,
      {
        // Atlas DNS hiccups must not leave the topology closed forever;
        // give the driver ~15s to find a server before giving up per call.
        serverSelectionTimeoutMS: 15_000,
      },
    );
  }

  return globalForAuth.bookNookMongoClient;
};

const connectWithRetry = async (client: MongoClient, attempts = 3) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      // Connect is a no-op when already connected, and it can re-open a
      // topology that was previously closed (e.g. by a dev-server reload).
      await client.connect();
      return;
    } catch (error) {
      lastError = error;
      console.error(
        `MongoDB connection attempt ${attempt}/${attempts} failed:`,
        error instanceof Error ? error.message : error,
      );

      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw lastError;
};

const client = getMongoClient();
const db = client.db("booknook");

// Connected once at module load; every auth request reuses this topology.
await connectWithRetry(client);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
