const app = require('../src/app');

// Vercel Serverless Function handler
module.exports = async (req, res) => {
  await app(req, res);
};