const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },

  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model('Users', userSchema, 'customCollectionName');

module.exports = Users;