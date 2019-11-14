const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId, ref: 'users',
  },
  rating: {
    type: Number,
  },
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
});

module.exports = Review = mongoose.model('review', ReviewSchema);
