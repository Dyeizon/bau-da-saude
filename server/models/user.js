const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },
    
    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    birthDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;