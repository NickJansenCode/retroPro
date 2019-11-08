const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordRecoverySchema = new Schema({
  question: {
    type: Schema.Types.ObjectId, ref: 'recoveryquestion',
  },
  answer: {
    type: String,
  },
});

module.exports = PasswordRecovery = mongoose.model('passwordrecovery', PasswordRecoverySchema);
