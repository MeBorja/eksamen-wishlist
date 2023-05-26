const { Schema, model, collection } = require('mongoose');


const wishSchema = new Schema({
    itemName :  {
      type: String,
      required: [true, 'Please enter an item name'],
      minlength: [1, 'Minimum item name length is 1 characters'],
    },
    description: {
      type: String,
      default: 'none',
  },
  username: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const wishlistSchema = new Schema({
  username: {
    type: String,
    required: true
  },
    wishes: [wishSchema]
}, {
  timestamps: true 
}
);


const Wishlist = model('wishlist', wishlistSchema)

module.exports = Wishlist