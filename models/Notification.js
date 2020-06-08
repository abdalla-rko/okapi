const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  friendRequest: {
    type: Schema.Types.ObjectId,
    ref: 'Friend'
  },
  roomInvite: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  seen: {
    type: Boolean,
    default: false
  }
},
{
  timmestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema);