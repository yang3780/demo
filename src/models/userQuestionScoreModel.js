const { getDB } = require('../config/db');

class UserQuestionScoreModel {
  static async create(userId, questionId, scoreEarned) {
    try {
      const db = getDB();
      // 先检查是否已存在
      const existing = await db.collection('user_question_scores').findOne({
        user_id: userId,
        question_id: questionId
      });
      
      if (existing) {
        return null;
      }
      
      const result = await db.collection('user_question_scores').insertOne({
        user_id: userId,
        question_id: questionId,
        score_earned: scoreEarned,
        solved_at: new Date()
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserIdAndQuestionId(userId, questionId) {
    const db = getDB();
    const score = await db.collection('user_question_scores').findOne({
      user_id: userId,
      question_id: questionId
    });
    if (score) {
      score.id = score._id;
      delete score._id;
    }
    return score;
  }

  static async getSolvedQuestionsByUserId(userId) {
    const db = getDB();
    const scores = await db.collection('user_question_scores').find({
      user_id: userId
    }).sort({ solved_at: -1 }).toArray();
    // 转换 _id 为 id
    return scores.map(score => {
      score.id = score._id;
      delete score._id;
      return score;
    });
  }

  static async getUsersSolvedQuestionCount(userId) {
    const db = getDB();
    const count = await db.collection('user_question_scores').countDocuments({
      user_id: userId
    });
    return count;
  }

  static async getTotalScoreByUserId(userId) {
    const db = getDB();
    const result = await db.collection('user_question_scores').aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: null, total: { $sum: '$score_earned' } } }
    ]).toArray();
    return result.length > 0 ? result[0].total : 0;
  }
}

module.exports = UserQuestionScoreModel;