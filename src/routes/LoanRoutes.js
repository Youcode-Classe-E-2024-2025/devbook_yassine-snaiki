// src/routes/LoanRoutes.js
import express from 'express';
import LoanController from '../controllers/LoanController.js';

const router = express.Router();

// Route for getting all loans
router.get('/', LoanController.getAllLoans);

// Route for getting a single loan by ID
router.get('/:id', LoanController.getLoanById);

// Route for creating a new loan
router.post('/', LoanController.createLoan);

// Route for updating an existing loan
router.put('/:id', LoanController.updateLoan);

// Route for deleting a loan
router.delete('/:id', LoanController.deleteLoan);

export default router;
