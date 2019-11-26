// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a User Report.
 */
const UserReportSchema = new Schema({
    reporter: {
        type: Schema.Types.ObjectId, ref: 'users',
    },
    reported: {
        type: Schema.Types.ObjectId, ref: 'users',
    },
    reportCategory: {
        type: Schema.Types.ObjectId, ref: 'reportcategory',
    },
    timestamp: {
        type: Date,
    },
    text: {
        type: String,
    },
    pending: {
        type: Boolean,
        default: true
    }
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = UserReport = mongoose.model('userreport', UserReportSchema);
