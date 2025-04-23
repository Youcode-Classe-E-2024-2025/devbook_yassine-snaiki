// authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import {db as pool} from '../config/db.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

dotenv.config();

const router = express.Router();

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
   
    try {
      await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name,email, hashedPassword]);
      res.status(201).json({ message: 'User registered' });
    } catch (err) {
      res.status(500).json({ error: 'User may already exist or DB error' });
    }
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userResult.rows[0];

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token,isAdmin: user.is_admin,id:user.id });
});

router.post('/logout', authenticateToken, async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token missing' });
  
    try {
      await pool.query('INSERT INTO blacklisted_tokens (token) VALUES ($1)', [token]);
      res.json({ message: 'Logged out and token blacklisted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not blacklist token' });
    }
  });

  

router.get('/me', authenticateToken, async (req, res) => {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];
    res.json(user);
  });
export default router;
