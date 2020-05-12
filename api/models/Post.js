import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Schema.Types.ObjectId,
    ref: 'Like'
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
},
{
  timestamps: true
});

export default mongoose.model('Post', postSchema);