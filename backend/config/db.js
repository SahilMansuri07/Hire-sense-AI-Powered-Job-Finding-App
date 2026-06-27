import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async () => {
  try {
    const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers.length > 0) {
      dns.setServers(dnsServers);
      // console.log(`Using DNS servers: ${dnsServers.join(", ")}`);
    }

    const safeMongoUri = (process.env.MONGO_URI || "").replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@");
    // console.log("Connecting to MongoDB..." + safeMongoUri);
    // console.log("Using database: " + (process.env.DB_NAME || "AI_based_Resume"));
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "AI_based_Resume",
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;