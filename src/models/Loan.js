import { db } from '../config/db.js';

export class Loan {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.book_id = data.book_id;
    this.loan_date = data.loan_date;
    this.due_date = data.due_date;
    this.return_date = data.return_date;
  }

  static async all() {
    const { rows } = await db.query('SELECT * FROM loans ORDER BY loan_date DESC');
    return rows.map(row => new Loan(row));
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM loans WHERE id = $1', [id]);
    return rows[0] ? new Loan(rows[0]) : null;
  }

  async save() {
    if (this.id) {
      const { rows } = await db.query(
        `UPDATE loans 
         SET user_id = $1, book_id = $2, loan_date = $3, due_date = $4, return_date = $5 
         WHERE id = $6 RETURNING *`,
        [this.user_id, this.book_id, this.loan_date, this.due_date, this.return_date, this.id]
      );
      return new Loan(rows[0]);
    } else {
      const { rows } = await db.query(
        `INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [this.user_id, this.book_id, this.loan_date, this.due_date, this.return_date]
      );
      return new Loan(rows[0]);
    }
  }

  static async delete(id) {
    await db.query('DELETE FROM loans WHERE id = $1', [id]);
  }

  static async findByUser(userId) {
    const { rows } = await db.query('SELECT * FROM loans WHERE user_id = $1', [userId]);
    return rows.map(row => new Loan(row));
  }

  static async findByBook(bookId) {
    const { rows } = await db.query('SELECT * FROM loans WHERE book_id = $1', [bookId]);
    return rows.map(row => new Loan(row));
  }
}
