const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: String,
  lastname: String,
  date: {
    type: Date,
    default: Date.now
  },
  refresh_token: String,
  bio: String,
  followers: Array,
  posts: Array,
  profile_pic: String,
  chat_rooms: Array,
  lastLogin: String,
  Notifications: Array,
  developer: Boolean
},{
  timestamps: true
});

module.exports = mongoose.model("Users", UserSchema);