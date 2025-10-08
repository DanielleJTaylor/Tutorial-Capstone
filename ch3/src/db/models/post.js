// src/db/models/post.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Path `title` is required.'],
      trim: true,
      validate: {
        validator: (v) => typeof v === 'string' && v.trim().length > 0,
        message: 'Path `title` is required.',
      },
    },
    author: { type: String, trim: true },
    contents: { type: String, trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', PostSchema);
