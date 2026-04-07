const { getDB } = require('../config/db');

class SubmissionModel {
  static async create(userId, questionId, code, language) {
    const db = getDB();
    const result = await db.collection('submissions').insertOne({
      user_id: userId,
      question_id: questionId,
      code,
      language,
      status: 'PENDING',
      submitted_at: new Date()
    });
    return result;
  }

  static async updateStatus(id, status, execTime, memoryUsed, judgedAt, message = null) {
    const db = getDB();
    const updateData = {
      status,
      exec_time: execTime,
      memory_used: memoryUsed,
      judged_at: judgedAt
    };
    
    if (message) {
      updateData.message = message;
    }
    
    const result = await db.collection('submissions').updateOne(
      { _id: id },
      { $set: updateData }
    );
    return result;
  }

  static async findById(id) {
    const db = getDB();
    const submission = await db.collection('submissions').findOne({ _id: id });
    if (submission) {
      submission.id = submission._id;
      delete submission._id;
    }
    return submission;
  }

  static async getSubmissionsByUserId(userId) {
    const db = getDB();
    const submissions = await db.collection('submissions').find({ user_id: userId })
      .sort({ submitted_at: -1 })
      .toArray();
    // 转换 _id 为 id
    return submissions.map(submission => {
      submission.id = submission._id;
      delete submission._id;
      return submission;
    });
  }

  static async getSubmissionsByQuestionId(questionId) {
    const db = getDB();
    const submissions = await db.collection('submissions').find({ question_id: questionId })
      .sort({ submitted_at: -1 })
      .toArray();
    // 转换 _id 为 id
    return submissions.map(submission => {
      submission.id = submission._id;
      delete submission._id;
      return submission;
    });
  }

  static async getSubmissionsByUserIdAndQuestionId(userId, questionId) {
    const db = getDB();
    const submissions = await db.collection('submissions').find({ user_id: userId, question_id: questionId })
      .sort({ submitted_at: -1 })
      .toArray();
    // 转换 _id 为 id
    return submissions.map(submission => {
      submission.id = submission._id;
      delete submission._id;
      return submission;
    });
  }

  static async getLatestSubmission(userId, questionId) {
    const db = getDB();
    const submission = await db.collection('submissions').findOne(
      { user_id: userId, question_id: questionId },
      { sort: { submitted_at: -1 } }
    );
    if (submission) {
      submission.id = submission._id;
      delete submission._id;
    }
    return submission;
  }

  static async getWeeklySubmissionCount(userId) {
    // 生成过去7天的日期
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    // 查询每天的提交数量
    const db = getDB();
    const submissions = await db.collection('submissions').find({
      user_id: userId,
      submitted_at: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }).toArray();
    
    // 将查询结果转换为按天分组的对象
    const submissionMap = {};
    submissions.forEach(submission => {
      const date = submission.submitted_at.toISOString().split('T')[0];
      submissionMap[date] = (submissionMap[date] || 0) + 1;
    });
    
    // 确保每天都有数据，没有提交的天计数为0
    const result = days.map(day => ({
      date: day,
      count: submissionMap[day] || 0
    }));
    
    return result;
  }
}

module.exports = SubmissionModel;