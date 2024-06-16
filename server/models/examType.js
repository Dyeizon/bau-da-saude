const mongoose = require('mongoose');

const examTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ExamType = mongoose.model('ExamType', examTypeSchema, 'examType');

module.exports = ExamType;