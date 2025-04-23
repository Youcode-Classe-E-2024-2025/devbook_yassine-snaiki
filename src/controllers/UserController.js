import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  const users = await User.all();
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  const savedUser = await user.save();
  res.status(201).json({ id: savedUser.id, name: savedUser.name, email: savedUser.email });
};
