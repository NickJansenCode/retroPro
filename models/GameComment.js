const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameCommentSchema = new Schema({
  commenter: {
    type: Schema.Types.ObjectId, ref: 'users',
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
});

module.exports = GameComment = mongoose.model('gamecomment', GameCommentSchema);
