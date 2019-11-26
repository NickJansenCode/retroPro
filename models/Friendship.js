// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Friendship.
 */
const FriendshipSchema = new Schema({
    friendA: {
        type: Schema.Types.ObjectId, ref: 'users',
    },
    friendB: {
        type: Schema.Types.ObjectId, ref: 'users',
    },
    pending: {
        type: Boolean,
        default: true
    }
});

// Export the document model. //
// eslint-disable-next-line no-undef
module.exports = Friendship = mongoose.model('friendship', FriendshipSchema);
