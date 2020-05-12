import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  seen: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

export default mongoose.model('Message', messageSchema);