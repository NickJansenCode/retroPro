const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId, ref: 'user',
  },
  recipient: {
    type: Schema.Types.ObjectId, ref: 'user',
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Number,
  },
});

module.exports = Message = mongoose.model('message', MessageSchema);
