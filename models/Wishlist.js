const { Schema, model } = require('mongoose');

const wishlistSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  itemName :  {
    type: String,
    required: [true, 'Please enter an item name'],
    unique: true,
    minlength: [3, 'Minimum item name length is 1 characters'],
  },
  description: {
    type: String,
    default: 'none',

  },
  priorety: {
    type: String,
    default: ' '
  },
}, {
  createdAt: new Date()
}
);
const Wishlist = model('wishlist', wishlistSchema)

module.exports = Wishlist