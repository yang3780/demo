const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userQuestionScoreRoutes = require('./routes/userQuestionScoreRoutes');
const { connectDB } = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/user-scores', userQuestionScoreRoutes);

// 静态文件服务，托管Vue打包后的前端页面
app.use(express.static(path.join(__dirname, '..', 'dist')));

// 健康检查端点
app.get('/api/health', async (req, res) => {
  try {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server is running' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error' 
    });
  }
});

// 处理所有其他请求，返回index.html（用于SPA路由）
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// 导出app供Serverless Function使用
module.exports = app;

// 本地开发时启动服务器
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  
  // 启动应用并连接数据库
  async function startApp() {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error starting app:', error);
      process.exit(1);
    }
  }
  
  startApp();
}