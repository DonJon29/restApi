import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import postsRouter from './routes/posts.js';

const app = express();

// Basic security headers
app.use(helmet());

// Enable CORS (optional)
app.use(cors());

// Parse JSON
app.use(express.json());

// Rate limiter: 100 requests per 2 minutes
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('Welcome to the Blog Posts API');
});

// Posts routes
app.use('/posts', postsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

