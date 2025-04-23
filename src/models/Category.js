// src/models/Category.js
import { db } from '../config/db.js';

export class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  }

  static async all() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
    return rows.map(row => new Category(row));
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return rows[0] ? new Category(rows[0]) : null;
  }

  async save() {
    if (this.id) {
      const { rows } = await db.query(
        'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
        [this.name, this.id]
      );
      return new Category(rows[0]);
    } else {
      const { rows } = await db.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING *',
        [this.name]
      );
      return new Category(rows[0]);
    }
  }

  static async delete(id) {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  }
}
