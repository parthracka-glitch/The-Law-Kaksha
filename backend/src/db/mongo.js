/**
 * The Law Kaksha - MongoDB Atlas Connection Manager
 * Connects via Mongoose to MongoDB Atlas Cluster0
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

// Serverless-friendly global cache pattern for Vercel/Render
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.warn("[MongoDB Atlas] MONGODB_URI not configured. Operating with local persistent database.");
    return mongoose.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    };

    console.log("[MongoDB Atlas] Connecting to cluster...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("[MongoDB Atlas] Connected successfully to 'thelawkaksha' database.");
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error("[MongoDB Atlas] Connection error:", err.message);
      console.warn("[MongoDB Atlas] Running with local fallback storage.");
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
  }

  return cached.conn || mongoose.connection;
}

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("[MongoDB Atlas] Disconnected.");
});

mongoose.connection.on("error", (err) => {
  isConnected = false;
  console.error("[MongoDB Atlas] Runtime error:", err.message);
});

module.exports = {
  connectMongo,
  isConnected: () => mongoose.connection.readyState === 1,
  mongoose,
};
