const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true, 
    trim: true,
    unique: true
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  refresh_token: String,
  followers: Array,
  profile_pic: String,
  chat_rooms: Array,
  lastLogin: String,
  isOnline: {
    type: Boolean,
    default: false
  },
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