// src/routes/LoanRoutes.js
import express from 'express';
import LoanController from '../controllers/LoanController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Route for getting all loans
router.get('/',authenticateToken, LoanController.getAllLoans);

// Route for getting a single loan by ID
router.get('/:id',authenticateToken, LoanController.getLoanById);

// Route for creating a new loan
router.post('/',authenticateToken, LoanController.createLoan);

// Route for updating an existing loan
router.put('/:id',authenticateToken, LoanController.updateLoan);

// Route for deleting a loan
router.delete('/:id',authenticateToken, LoanController.deleteLoan);

export default router;
