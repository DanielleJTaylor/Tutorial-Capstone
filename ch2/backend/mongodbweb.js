import { createServer } from 'node:http';
import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'ch2';
const client = new MongoClient(url);

await client.connect();
console.log('✅ Connected to MongoDB');

const db = client.db(dbname);
const users = db.collection('users');

// Seed once if empty
const count = await users.estimatedDocumentCount();
if (count === 0) {
  await users.insertMany([
    { username: 'dan',  fullName: 'Daniel Bugl', age: 26 },
    { username: 'jane', fullName: 'Jane Doe',    age: 32 },
    { username: 'jonh', fullName: 'John Doe',    age: 30 }
  ]);
  console.log('🌱 Seeded users');
} else {
  console.log(`📦 Existing users: ${count}`);
}

const server = createServer(async (_req, res) => {
  try {
    const list = await users.find().toArray();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(list));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(3000, 'localhost', () => {
  console.log('🌐 http://localhost:3000');
});
