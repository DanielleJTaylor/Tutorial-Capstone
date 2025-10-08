// src/routes/posts.js
import express from 'express';
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js';

export default function postsRoutes(app) {
  const router = express.Router();

  // GET /api/v1/posts?author=...&tag=...&sortBy=createdAt|updatedAt&sortOrder=ascending|descending
  router.get('/posts', async (req, res, next) => {
    try {
      const { author, tag, sortBy, sortOrder } = req.query;

      let rows;
      if (author) rows = await listPostsByAuthor(author, { sortBy, sortOrder });
      else if (tag) rows = await listPostsByTag(tag, { sortBy, sortOrder });
      else rows = await listAllPosts({ sortBy, sortOrder });

      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/v1/posts/:id
  router.get('/posts/:id', async (req, res, next) => {
    try {
      const row = await getPostById(req.params.id);
      if (!row) return res.sendStatus(404);
      res.json(row);
    } catch (err) {
      next(err);
    }
  });

  // POST /api/v1/posts
  router.post('/posts', async (req, res, next) => {
    try {
      const created = await createPost(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  });

  // PATCH /api/v1/posts/:id
  router.patch('/posts/:id', async (req, res, next) => {
    try {
      const updated = await updatePost(req.params.id, req.body);
      if (!updated) return res.sendStatus(404);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/v1/posts/:id
  router.delete('/posts/:id', async (req, res, next) => {
    try {
      const result = await deletePost(req.params.id); // { acknowledged, deletedCount }
      if (!result?.deletedCount) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  app.use('/api/v1', router);
}
