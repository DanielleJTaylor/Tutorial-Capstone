// src/services/posts.js
import { Post } from '../db/models/post.js';

// helpers
function normalizeSort(sortBy = 'createdAt', sortOrder = 'descending') {
  const dir = String(sortOrder).toLowerCase().startsWith('asc') ? 1 : -1;
  // tie-breaker on _id so ordering is deterministic when timestamps are equal
  return { [sortBy]: dir, _id: dir };
}

// CREATE
export async function createPost(data) {
  const doc = new Post(data);
  return doc.save();
}

// GENERIC LIST
export async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {}
) {
  return Post.find(query).sort(normalizeSort(sortBy, sortOrder));
}

// LIST: all (supports sort options)
export async function listAllPosts(
  { sortBy = 'createdAt', sortOrder = 'descending' } = {}
) {
  return Post.find({}).sort(normalizeSort(sortBy, sortOrder));
}

// LIST: by author (supports sort options)
export async function listPostsByAuthor(
  author,
  { sortBy = 'createdAt', sortOrder = 'descending' } = {}
) {
  return Post.find({ author }).sort(normalizeSort(sortBy, sortOrder));
}

// LIST: by tag (supports sort options)
export async function listPostsByTag(
  tag,
  { sortBy = 'createdAt', sortOrder = 'descending' } = {}
) {
  return Post.find({ tags: tag }).sort(normalizeSort(sortBy, sortOrder));
}

// GET ONE
export async function getPostById(id) {
  return Post.findById(id);
}

// UPDATE (run validators)
export async function updatePost(id, updates) {
  return Post.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    context: 'query',
  });
}

// DELETE (return acknowledged + deletedCount)
export async function deletePost(id) {
  return Post.deleteOne({ _id: id });
}
