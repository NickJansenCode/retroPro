const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    items: [{
        type: Schema.Types.ObjectId, ref: 'game',
    }],
});

module.exports = Collection = mongoose.model('collection', CollectionSchema);
