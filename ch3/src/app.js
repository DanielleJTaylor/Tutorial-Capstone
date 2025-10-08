// src/app.js
import express from 'express';
import postsRoutes from './routes/posts.js';

const app = express();
app.use(express.json());
postsRoutes(app);

export { app };

