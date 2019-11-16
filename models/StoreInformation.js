const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreInformationSchema = new Schema({
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
});

module.exports = StoreInformation = mongoose.model('storeinformation', StoreInformationSchema);
