// src/models/Book.js
import { db } from '../config/db.js';

export class Book {
  constructor({ id, title, author, category_id, status, created_at, category_name }) {
    this.id           = id;
    this.title        = title;
    this.author       = author;
    this.categoryId   = category_id;
    this.status       = status;
    this.createdAt    = created_at;
    this.categoryName = category_name; // Directly storing the category name
  }

  static async all({ page = 1, perPage = 10, filter = {}, sort = 'title' } = {}) {
    const offset = (page - 1) * perPage;
    const whereClauses = [];
    const params = [];
  
    if (filter.status) {
      params.push(filter.status);
      whereClauses.push(`status = $${params.length}`);
    }
    if (filter.categoryId) {
      params.push(filter.categoryId);
      whereClauses.push(`category_id = $${params.length}`);
    }
    if (filter.title) {
        params.push(`%${filter.title.$regex}%`);
        whereClauses.push(`title ILIKE $${params.length}`);
      }
  
    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
    // Validate and sanitize `sort`
    const allowedSortFields = ['title', 'author', 'created_at', 'status'];
    const safeSort = allowedSortFields.includes(sort) ? sort : 'title';
  
    // Add limit and offset
    params.push(perPage, offset);
  
    const query = `
      SELECT books.*, categories.name AS category_name
      FROM books
      LEFT JOIN categories ON books.category_id = categories.id
      ${whereSQL}
      ORDER BY ${safeSort}
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `;
  
    const result = await db.query(query, params);
    return result.rows.map(r => new Book(r)); // Each book now has a category name
  }
  

  static async findById(id) {
    const { rows } = await db.query(
      `SELECT books.*, categories.name AS category_name
       FROM books
       LEFT JOIN categories ON books.category_id = categories.id
       WHERE books.id = $1`,
      [id]
    );
    return rows[0] ? new Book(rows[0]) : null; // Each book now has a category name
  }

  async save() {
    if (this.id) {
      await db.query(
        `UPDATE books 
         SET title = $1, author = $2, category_id = $3, status = $4 
         WHERE id = $5`,
        [this.title, this.author, this.categoryId, this.status, this.id]
      );
    } else {
      const result = await db.query(
        `INSERT INTO books (title, author, category_id, status) 
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [this.title, this.author, this.categoryId, this.status]
      );
      this.id        = result.rows[0].id;
      this.createdAt = result.rows[0].created_at;
    }
    return this;
  }

  static async delete(id) {
    await db.query(`DELETE FROM books WHERE id = $1`, [id]);
  }
}
