/**
 * The Law Kaksha - MongoDB Atlas Connection Manager
 * Connects via Mongoose to MongoDB Atlas Cluster0
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

let isConnected = false;

async function connectMongo() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!MONGODB_URI) {
    console.warn("[MongoDB Atlas] MONGODB_URI not configured. Operating with local persistent database.");
    return mongoose.connection;
  }

  try {
    console.log("[MongoDB Atlas] Connecting to cluster...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log("[MongoDB Atlas] Connected successfully to 'thelawkaksha' database.");
  } catch (err) {
    isConnected = false;
    console.error("[MongoDB Atlas] Connection error:", err.message);
    console.warn("[MongoDB Atlas] Running with local fallback storage.");
  }

  return mongoose.connection;
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
