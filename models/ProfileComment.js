const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = ProfileComment = mongoose.model('profilecomment', ProfileCommentSchema);
