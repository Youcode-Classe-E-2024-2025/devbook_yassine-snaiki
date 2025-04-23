// src/models/Book.js
import { db } from '../config/db.js';

export class Book {
  constructor({ id, title, author, category_id, status, created_at }) {
    this.id         = id;
    this.title      = title;
    this.author     = author;
    this.categoryId = category_id;
    this.status     = status;
    this.createdAt  = created_at;
  }

  static async all({ page = 1, perPage = 10, filter = {}, sort = 'title' } = {}) {
    const offset = (page - 1) * perPage;
    let whereClauses = [];
    let params = [];

    if (filter.status) {
      params.push(filter.status);
      whereClauses.push(`status = $${params.length}`);
    }
    if (filter.categoryId) {
      params.push(filter.categoryId);
      whereClauses.push(`category_id = $${params.length}`);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    // final params: [...filters, perPage, offset]
    params.push(perPage, offset, sort);

    // Note: ORDER BY column name can't be parameterized, so we interpolate it **carefully**:
    const [rows] = await db.query(
      `SELECT * FROM books
       ${whereSQL}
       ORDER BY ${sort} 
       LIMIT $${params.length - 1} 
       OFFSET $${params.length}`,
      params
    );

    return rows.map(r => new Book(r));
  }

  static async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM books WHERE id = $1`,
      [id]
    );
    return rows[0] ? new Book(rows[0]) : null;
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
         RETURNING id, created_at`,
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
