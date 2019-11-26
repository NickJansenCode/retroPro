// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Recovery Question.
 */
const RecoveryQuestionSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = RecoveryQuestion = mongoose.model('recoveryquestion', RecoveryQuestionSchema);
