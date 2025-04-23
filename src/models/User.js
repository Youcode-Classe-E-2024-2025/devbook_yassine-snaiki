import { db } from '../config/db.js';

export class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password; // store hashed password
  }

  static async all() {
    const { rows } = await db.query('SELECT id, name, email FROM users ORDER BY name');
    return rows.map(row => new User(row));
  }

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] ? new User(rows[0]) : null;
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] ? new User(rows[0]) : null;
  }

  async save() {
    if (this.id) {
      const { rows } = await db.query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
        [this.name, this.email, this.password, this.id]
      );
      return new User(rows[0]);
    } else {
      const { rows } = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [this.name, this.email, this.password]
      );
      return new User(rows[0]);
    }
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
