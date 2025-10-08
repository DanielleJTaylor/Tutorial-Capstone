// src/db/init.js
import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog';

export async function initDatabase() {
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  await mongoose.connect(URI, { autoIndex: true });
  console.info(`successfully connected to database: ${mongoose.connection.client.s.url || URI}`);
}

export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close(true);
  }
}
