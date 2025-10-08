// ch3/src/test/setupFileAfterEnv.js
import mongoose from 'mongoose';
import { beforeAll, afterAll } from '@jest/globals';
import { initDatabase } from '../db/init.js'; // uses your existing init.js

beforeAll(async () => {
  await initDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});
