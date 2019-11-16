const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlatformSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = Platform = mongoose.model('platform', PlatformSchema);
