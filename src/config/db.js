import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 5432,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max:      10,       // optional pool max
  idleTimeoutMillis: 30000,
});
