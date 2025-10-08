// ch3/src/test/globalSetup.js
import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  // start an in-memory MongoDB (version matches the slide)
  const instance = await MongoMemoryServer.create({
    binary: { version: '6.0.4' }
  });

  // keep a reference so teardown can stop it
  global.__MONGOINSTANCE = instance;

  // hand Jest tests a DB URL (choose a db name, e.g., "blog")
  process.env.DATABASE_URL = instance.getUri('blog');
}
