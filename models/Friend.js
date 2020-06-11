const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendSchema = Schema({
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
