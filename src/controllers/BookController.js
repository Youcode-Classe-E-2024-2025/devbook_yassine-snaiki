// src/controllers/bookController.js
import { Book } from '../models/Book.js';

export const getAllBooks = async (req, res) => {
    try {
      const { page, perPage, status, categoryId, sort, search } = req.query;
      
      // Build the query filters based on provided query parameters
      const filters = {
        status,
        categoryId,
        ...(search && { title: { $regex: search, $options: 'i' } }), // Add search filter for title (case insensitive)
      };
  
      // Update the query for the Book model (ensure your database query supports the search filter)
      const books = await Book.all({
        page: Number(page) || 1,
        perPage: Number(perPage) || 10,
        filter: filters,
        sort: sort || 'title',
      });
  
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = new Book({ ...req.body, id: req.params.id });
    const updated = await book.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    await Book.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
