import CategoryRoutes from './src/routes/CategoryRoutes.js';
import BookRoutes from './src/routes/BookRoutes.js';
import UserRoutes from './src/routes/UserRoutes.js';
import LoanRoutes from './src/routes/LoanRoutes.js';
import dotenv from 'dotenv';
import authRoutes from './src/routes/AuthRoutes.js';
import { authenticateToken } from './src/middleware/authenticateToken.js';



import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;
dotenv.config();


// Middleware to parse JSON
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You are authorized!', user: req.user });
  });
  
// A test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.use('/api/books', BookRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/loans', LoanRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
