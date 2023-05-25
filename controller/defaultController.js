const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Wishlist = require('../models/Wishlist')
const { requireAuth, checkUser, checkAdmin } = require('../middleware/authMiddleware');
const { handleErrors }  = require('./authController')

module.exports.main_get = async (req, res) => {
  try {
    const data = await Wishlist.aggregate([
      { $sort: { createdAt: -1 } }, // Sort by createdAt in ascending order
      {
        $group: {
          _id: '$username', // Group by username field
          document: { $last: '$$ROOT' } // Select the first document for each group
        }
      },
      { $limit: 5 } // Limit the result to 5 documents (optional)
    ]);
    res.render('home', { wish: data });
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateWish_post = [requireAuth, async (req, res) => {
    const { itemName, description, id } = req.body;
    const updatedValue = {
      itemName, description
    };
;
    try {
      const updatedWish = await Wishlist.findByIdAndUpdate(id, updatedValue, { new: true }).sort({createdAt: +1});
      if (updatedWish) {
        console.log('Wish updated:', updatedWish);
        res.status(201).json(updatedWish);
      } else {
        console.log('Wish not found');
        res.status(404).json({ error: 'Wish not found' });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: 'An error occurred' });
    }
  }];
  module.exports.deleteWish_post = [requireAuth, async (req, res) => {
    const {id } = req.body;
;
    try {
      const updatedWish = await Wishlist.findByIdAndDelete(id);
      if (updatedWish) {
        res.status(201).json(updatedWish);
      } else {
        console.log('Wish not found');
        res.status(404).json({ error: 'Wish not found' });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: 'An error occurred' });
    }
  }];

  module.exports.homeUser_get = [checkUser, async (req, res) => {
    const userId = req.params.id
    const list = await Wishlist.find({username:userId})
    const wishlists = () =>
              res.render('userPage', {wish: list, userId})
          wishlists()
  }]

  module.exports.wishlist_post =  [checkUser, async (req, res) => {
    const { itemName, username, description } = req.body;
    try {
      
      const wishlists = await Wishlist.create({itemName, username, description})
      res.status(201).json(wishlists)
    } catch (error) {
      console.log(error);
      res.status(400)
    }
    
  }]
  module.exports.id_get = [checkUser, async (req,res) => {
    const id = req.params.id
    const list = await Wishlist.find({username:id}).sort({createdAt: +1})
    const wishlists = () =>
              res.render('target', {wish: list})
          wishlists()
          }]
  
  
  