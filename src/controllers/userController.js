const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel');
require('dotenv').config();

class UserController {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    try {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create(username, hashedPassword, email, 'user');

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, total_score: user.total_score } });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserInfo(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ id: user.id, username: user.username, email: user.email, role: user.role, total_score: user.total_score, created_at: user.created_at });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getLeaderboard(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createAdmin(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    try {
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create(username, hashedPassword, email, 'admin');

      res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateUserRole(req, res) {
    const { userId, role } = req.body;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      await UserModel.updateRole(userId, role);
      res.json({ message: 'User role updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { getDB } = require('../config/db');
      const db = getDB();
      await db.collection('users').deleteOne({ _id: userId });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;