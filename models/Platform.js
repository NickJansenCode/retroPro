// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Platform.
 */
const PlatformSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = Platform = mongoose.model('platform', PlatformSchema);
