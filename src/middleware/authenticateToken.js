
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// export function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader?.split(' ')[1];

//   if (!token) return res.status(401).json({ error: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ error: 'Invalid token' });
//   }
// }

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db as pool } from '../config/db.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    // Check if token is blacklisted
    const result = await pool.query('SELECT * FROM blacklisted_tokens WHERE token = $1', [token]);
    if (result.rowCount > 0) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
