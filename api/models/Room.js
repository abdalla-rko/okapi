import mongoose from 'mongoose';

const schema = mongoose.schema;

const roomSchema = new Schema({
  name: String,
  users: Array,
  chats: Array
},
{
  timestamps: true
});

export default mongoose.model('Room', roomSchema);