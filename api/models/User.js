import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  image: String,
  isOnline: {
    type: Boolean,
    default: false
  },
  date_account_created: {
    type: String,
    required: true
  },
  bio_profile: String,
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Follow',
    }
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    }
  ]
},
{
  timestamps: true
});

export default mongoose.model('User', userSchema);