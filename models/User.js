const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  gameCollection: {
    type: Schema.Types.ObjectId, ref: 'collection',
  },
  wishlist: {
    type: Schema.Types.ObjectId, ref: 'wishlist',
  },
  lists: [{
    type: Schema.Types.ObjectId, ref: 'list',
  }],
  highlights: [{
    type: Schema.Types.ObjectId, ref: 'game',
  }],
  gamesPlayed: [{
    type: Schema.Types.ObjectId, ref: 'game',
  }],
  role: {
    type: Schema.Types.ObjectId, ref: 'role',
  },
  passwordrecovery: {
    type: Schema.Types.ObjectId, ref: 'passwordrecovery',
  },
  settings: {
    type: Schema.Types.ObjectId, ref: 'settings',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepicture: {
    type: String,
    required: true,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  headerpicture: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: true,
    default: 'This user hasn\'t uploaded a description!',
  },
  isbanned: {
    type: Boolean,
    required: true,
    default: false,
  },
  tags: [{
    type: String,
  }],
});

module.exports = User = mongoose.model('users', UserSchema);
