const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  platform: {
    type: Schema.Types.ObjectId,
    ref: 'platform',
  },
  year: {
    type: Number,
  },
  name: {
    type: String,
  },
  coverart: {
    type: String,
  },
  description: {
    type: String,
  },
  inreviewqueue: {
    type: Boolean,
  },
});

module.exports = Game = mongoose.model('game', GameSchema);
