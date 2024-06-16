const mongoose = require('mongoose');

const resultTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ResultType = mongoose.model('ResultType', resultTypeSchema, 'resultType');

module.exports = ResultType;