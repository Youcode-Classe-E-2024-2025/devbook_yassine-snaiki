// src/controllers/LoanController.js
import {db as pool} from '../config/db.js';
import { Loan } from '../models/Loan.js';

const LoanController = {
  // Get all loans
  async getAllLoans(req, res) {
    try {
      const result = await Loan.all();
      res.json(result);
    } catch (error) {
      console.error('Error fetching loans:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Get loan by ID
  async getLoanById(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM loans WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Loan not found');
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching loan by ID:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Create a new loan
  async createLoan(req, res) {
    const { book_id, user_id, loan_date, return_date,due_date } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO loans (book_id, user_id, loan_date,due_date, return_date) VALUES ($1, $2, $3, $4,$5) RETURNING *',
        [book_id, user_id, loan_date, due_date,return_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating loan:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Update an existing loan
  async updateLoan(req, res) {
    const { id } = req.params;
    const { book_id, user_id, loan_date, return_date } = req.body;
    try {
      const result = await pool.query(
        'UPDATE loans SET book_id = $1, user_id = $2, loan_date = $3, return_date = $4 WHERE id = $5 RETURNING *',
        [book_id, user_id, loan_date, return_date, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send('Loan not found');
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating loan:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Delete a loan
  async deleteLoan(req, res) {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM loans WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Loan not found');
      }
      res.json({ message: 'Loan deleted successfully' });
    } catch (error) {
      console.error('Error deleting loan:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};

export default LoanController;
