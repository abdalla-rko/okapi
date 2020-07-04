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
  refresh_token: String,
  profile_pic: String,
  chat_rooms: Array,
  isOnline: {
    type: Boolean,
    default: false
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Friend'
    }
  ],
  Notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notification'
    }
  ],
},{
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);