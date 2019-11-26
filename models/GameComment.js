// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Game Comment.
 */
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

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = GameComment = mongoose.model('gamecomment', GameCommentSchema);
