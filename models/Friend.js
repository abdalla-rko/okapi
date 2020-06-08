const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  friendRequest: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timmestamps: true
})

module.exports = mongoose.model('Friend', friendSchema);
