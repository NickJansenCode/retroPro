// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Review.
 */
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

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = Review = mongoose.model('review', ReviewSchema);
