const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = Friendship = mongoose.model('friendship', FriendshipSchema);
