const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  nightmode: {
    type: Boolean,
  },
  private: {
    type: Boolean,
  },
  fontsize: {
    type: Number,
  },
  fontname: {
    type: String,
  },
});

module.exports = Settings = mongoose.model('settings', SettingsSchema);
