const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId, ref: 'game',
  }],
});

module.exports = Wishlist = mongoose.model('wishlist', WishlistSchema);
