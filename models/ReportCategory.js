const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportCategorySchema = new Schema({
  name: {
    type: String,
  },
});

module.exports = ReportCategory = mongoose.model('reportcategory', ReportCategorySchema);
