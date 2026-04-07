const { getDB } = require('../config/db');

class UserModel {
  static async create(username, password, email, role = 'user') {
    try {
      console.log('Attempting to create user:', username, email, role);
      const db = getDB();
      const result = await db.collection('users').insertOne({
        username,
        password,
        email,
        role,
        total_score: 0,
        created_at: new Date()
      });
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByUsername(username) {
    const db = getDB();
    const user = await db.collection('users').findOne({ username });
    if (user) {
      user.id = user._id;
      delete user._id;
    }
    return user;
  }

  static async findByEmail(email) {
    const db = getDB();
    const user = await db.collection('users').findOne({ email });
    if (user) {
      user.id = user._id;
      delete user._id;
    }
    return user;
  }

  static async findById(id) {
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: id });
    if (user) {
      user.id = user._id;
      delete user._id;
    }
    return user;
  }

  static async updateScore(userId, score) {
    const db = getDB();
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $inc: { total_score: score } }
    );
    return result;
  }

  static async getAllUsers() {
    const db = getDB();
    const users = await db.collection('users').find(
      {},
      { projection: { _id: 1, username: 1, email: 1, role: 1, total_score: 1, created_at: 1 } }
    ).sort({ total_score: -1 }).toArray();
    
    // 转换 _id 为 id
    return users.map(user => {
      user.id = user._id;
      delete user._id;
      return user;
    });
  }

  static async updateRole(userId, role) {
    const db = getDB();
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $set: { role } }
    );
    return result;
  }
}

module.exports = UserModel;