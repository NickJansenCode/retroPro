const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
    friendA: {
        type: Schema.Types.ObjectId, ref: 'user',
    },
    friendB: {
        type: Schema.Types.ObjectId, ref: 'user',
    },
});

module.exports = Friendship = mongoose.model('friendship', FriendshipSchema);
