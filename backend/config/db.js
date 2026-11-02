const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hirenet';
    console.log(`[DB] Attempting connection to MongoDB at: ${connStr}`);
    
    // Set short timeout for local connection attempt
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Primary MongoDB connection failed (${err.message}). Starting In-Memory MongoDB Server...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[DB] In-Memory MongoDB Connected at: ${mongoUri}`);
    } catch (memErr) {
      console.error(`[DB] In-Memory MongoDB Failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
