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
  fullName: String,
  date: {
    type: Date,
    default: Date.now
  },
  refresh_token: String,
  followers: Array,
  profile_pic: String,
  chat_rooms: Array,
  lastLogin: String,
  message: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Friend'
    }
  ],
  Notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Follow'
    }
  ],
},{
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);