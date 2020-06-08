const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: String,
  seen: {
    type: Boolean,
    default: false
  }
},
{
  timmestamps: true
})

module.exports = mongoose.model('Message', messageSchema);