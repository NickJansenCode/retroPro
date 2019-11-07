const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecoveryQuestionSchema = new Schema({
     text: {type: String}
});

module.exports = RecoveryQuestion = mongoose.model("recoveryquestion", RecoveryQuestionSchema);
