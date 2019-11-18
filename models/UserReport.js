const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserReportSchema = new Schema({
    reporter: {
        type: Schema.Types.ObjectId, ref: 'user',
    },
    reported: {
        type: Schema.Types.ObjectId, ref: 'user',
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

module.exports = UserReport = mongoose.model('userreport', UserReportSchema);
