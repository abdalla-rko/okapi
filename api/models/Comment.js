import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const followSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
});

export default mongoose.model('Follow', followSchema);