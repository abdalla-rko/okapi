import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  likes: {
    type: Schema.Types.ObjectId,
    ref: 'Like'
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  seen: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);