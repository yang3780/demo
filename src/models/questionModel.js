const { getDB } = require('../config/db');

class QuestionModel {
  static async create(title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, score, type, timeLimit, memoryLimit) {
    const db = getDB();
    const result = await db.collection('questions').insertOne({
      title,
      description,
      input_format: inputFormat,
      output_format: outputFormat,
      sample_input: sampleInput,
      sample_output: sampleOutput,
      difficulty,
      score,
      type,
      time_limit: timeLimit,
      memory_limit: memoryLimit
    });
    return result;
  }

  static async findById(id) {
    const db = getDB();
    const question = await db.collection('questions').findOne({ _id: id });
    if (question) {
      question.id = question._id;
      delete question._id;
    }
    return question;
  }

  static async getAllQuestions() {
    const db = getDB();
    const questions = await db.collection('questions').find({}).toArray();
    // 转换 _id 为 id
    return questions.map(question => {
      question.id = question._id;
      delete question._id;
      return question;
    });
  }

  static async getQuestionsByDifficulty(difficulty) {
    const db = getDB();
    const questions = await db.collection('questions').find({ difficulty }).toArray();
    // 转换 _id 为 id
    return questions.map(question => {
      question.id = question._id;
      delete question._id;
      return question;
    });
  }

  static async getQuestionsByType(type) {
    const db = getDB();
    const questions = await db.collection('questions').find({ type }).toArray();
    // 转换 _id 为 id
    return questions.map(question => {
      question.id = question._id;
      delete question._id;
      return question;
    });
  }

  static async getQuestionsByDifficultyAndType(difficulty, type) {
    const db = getDB();
    const questions = await db.collection('questions').find({ difficulty, type }).toArray();
    // 转换 _id 为 id
    return questions.map(question => {
      question.id = question._id;
      delete question._id;
      return question;
    });
  }

  static async update(id, title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, score, type, timeLimit, memoryLimit) {
    const db = getDB();
    const result = await db.collection('questions').updateOne(
      { _id: id },
      {
        $set: {
          title,
          description,
          input_format: inputFormat,
          output_format: outputFormat,
          sample_input: sampleInput,
          sample_output: sampleOutput,
          difficulty,
          score,
          type,
          time_limit: timeLimit,
          memory_limit: memoryLimit
        }
      }
    );
    return result;
  }

  static async delete(id) {
    const db = getDB();
    const result = await db.collection('questions').deleteOne({ _id: id });
    return result;
  }
}

module.exports = QuestionModel;