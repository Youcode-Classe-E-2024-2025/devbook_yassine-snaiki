// src/routes/bookRoutes.js
import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/BookController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/',authenticateToken, createBook);
router.put('/:id',authenticateToken, updateBook);
router.delete('/:id',authenticateToken, deleteBook);

export default router;
