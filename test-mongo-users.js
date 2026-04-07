const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function testMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection('users');

    // 检查用户数量
    const userCount = await usersCollection.countDocuments();
    console.log('Total users:', userCount);

    // 列出所有用户
    const users = await usersCollection.find({}).toArray();
    console.log('Users:', users);

    // 添加测试用户
    console.log('Adding test user...');
    const testUser = {
      username: 'testuser',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // 密码: test123
      email: 'test@example.com',
      role: 'user',
      total_score: 0,
      created_at: new Date()
    };

    const result = await usersCollection.insertOne(testUser);
    console.log('Test user added:', result.insertedId);

    // 再次检查用户数量
    const newUserCount = await usersCollection.countDocuments();
    console.log('New total users:', newUserCount);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testMongoDB();