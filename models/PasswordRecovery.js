// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Password Recovery.
 */
const PasswordRecoverySchema = new Schema({
    question: {
        type: Schema.Types.ObjectId, ref: 'recoveryquestion',
    },
    answer: {
        type: String,
    },
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = PasswordRecovery = mongoose.model('passwordrecovery', PasswordRecoverySchema);
