// ch3/src/example.js
import { initDatabase } from './db/init.js';
import { Post } from './db/models/post.js';
import mongoose from 'mongoose';

await initDatabase();

// create a new post (createdAt === updatedAt initially)
const createdPost = await Post.create({
  title: 'Hello Mongoose!',
  author: 'Danny',
  contents: 'Stored via Mongoose with timestamps.',
  tags: ['mongoose', 'mongodb']
});
console.log('created:', {
  id: createdPost._id.toString(),
  createdAt: createdPost.createdAt,
  updatedAt: createdPost.updatedAt
});

// update the post to bump updatedAt
const updatedPost = await Post.findByIdAndUpdate(
  createdPost._id,
  { $set: { title: 'Hello again, Mongoose!' } },
  { new: true } // return the updated doc
);
console.log('updated:', {
  id: updatedPost._id.toString(),
  createdAt: updatedPost.createdAt,
  updatedAt: updatedPost.updatedAt
});

// show all posts (title + timestamps)
const posts = await Post.find().select('title createdAt updatedAt').lean();
console.log('all posts:', posts);

await mongoose.disconnect();
console.log('done.');
