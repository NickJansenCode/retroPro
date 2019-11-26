// NPM IMPORTS //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the document schema for a Report Category.
 */
const ReportCategorySchema = new Schema({
    name: {
        type: String,
    },
});

// Export the document schema. //
// eslint-disable-next-line no-undef
module.exports = ReportCategory = mongoose.model('reportcategory', ReportCategorySchema);
