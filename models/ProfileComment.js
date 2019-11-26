// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Profile Comment.
 */
const ProfileCommentSchema = new Schema({
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

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = ProfileComment = mongoose.model('profilecomment', ProfileCommentSchema);
