const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = List = mongoose.model('list', ListSchema);
