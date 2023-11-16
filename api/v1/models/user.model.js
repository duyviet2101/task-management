const mongoose = require("mongoose");
const generate = require('../../../helpers/generate.js')

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(30)
    },
    status: {
      type: String,
      default: 'active'
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema, "users");

module.exports = user;