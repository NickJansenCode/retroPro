// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Game.
 */
const GameSchema = new Schema({
    platform: {
        type: Schema.Types.ObjectId,
        ref: 'platform',
        required: true,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'gamecomment',
        required: true,
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'review',
        required: true,
    }],
    year: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    coverart: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    inreviewqueue: {
        type: Boolean,
        default: true,
    },
});

// Expor the document model.
// eslint-disable-next-line no-undef
module.exports = Game = mongoose.model('game', GameSchema);
