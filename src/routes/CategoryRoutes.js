// src/routes/categoryRoutes.js
import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/CategoryController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/',authenticateToken, getAllCategories);
router.get('/:id',authenticateToken, getCategoryById);
router.post('/',authenticateToken, createCategory);
router.put('/:id',authenticateToken, updateCategory);
router.delete('/:id',authenticateToken, deleteCategory);

export default router;
