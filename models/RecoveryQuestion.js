const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecoveryQuestionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
});

module.exports = RecoveryQuestion = mongoose.model('recoveryquestion', RecoveryQuestionSchema);
