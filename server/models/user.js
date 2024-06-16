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

  birthDate: {
    type: Date,
    required: true,
  },

}, {timestamps: true});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;