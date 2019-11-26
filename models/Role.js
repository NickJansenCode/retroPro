// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Role.
 */
const RoleSchema = new Schema({
    name: {
        type: String,
    },
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = Role = mongoose.model('role', RoleSchema);
