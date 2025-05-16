import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  try {
    const [result] = await pool.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
    res.status(201).json({ id: result.insertId, title, content });
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  if (!title && !content) return res.status(400).json({ error: 'Title or content required to update' });

  try {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });

    const post = rows[0];
    const updatedTitle = title ?? post.title;
    const updatedContent = content ?? post.content;

    await pool.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [updatedTitle, updatedContent, req.params.id]);
    res.json({ id: Number(req.params.id), title: updatedTitle, content: updatedContent });
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;