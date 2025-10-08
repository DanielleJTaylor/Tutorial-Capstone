// src/index.js
import 'dotenv/config';
import { app } from './app.js';
import { initDatabase } from './db/init.js';

const PORT = Number(process.env.PORT) || 3001; // <— 3001 fallback

try {
  await initDatabase();
  app.listen(PORT, () => {
    console.info(`express server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('error connecting to database:', err);
  process.exit(1);
}
