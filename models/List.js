// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a List.
 */
const ListSchema = new Schema({
    items: [{
        type: Schema.Types.ObjectId, ref: 'game',
    }],
    name: {
        type: String,
    },
    description: {
        type: String,
    },
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = List = mongoose.model('list', ListSchema);
