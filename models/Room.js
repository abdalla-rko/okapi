const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = Schema({
  id: String, // "12ojahsdbi2qwbdoihabfqyyegr8uyadf823798w791" Combined _id of users
  name: String,
  users: Array, // ["John", "Doe"]
  chats: Array // {txt:"Hi", by:"john", time:"10:35pm"}
})

module.exports = mongoose.model('Rooms', ChatSchema);