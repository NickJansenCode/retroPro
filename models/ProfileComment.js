const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileCommentSchema = new Schema({
  commenter: {
    type: Schema.Types.ObjectId, ref: 'user',
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Number,
  },
});

module.exports = ProfileComment = mongoose.model('profilecomment', ProfileCommentSchema);
