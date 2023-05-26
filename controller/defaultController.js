const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Wishlist = require('../models/Wishlist')
const { requireAuth, checkUser, checkAdmin } = require('../middleware/authMiddleware');
const { handleErrors }  = require('./authController');
const e = require("express");

module.exports.main_get = async (req, res) => {
  try {
    const data = await Wishlist.aggregate([
      {
        $group: {
          _id: '$username',
          document: { $last: '$$ROOT' }
        }
      },
      { $limit: 5 },
      {
        $project: {
          username: '$document.username',
          itemName: { $arrayElemAt: ['$document.wishes.itemName', 0] },
          description: { $arrayElemAt: ['$document.wishes.description', 0] }
        }
      }
    ]);
    res.render('home', { wish: data });
  } catch (error) {
    console.log(error);
  }
};


module.exports.updateWish_post = [requireAuth, async (req, res) => {
  const { itemName, description, username, id } = req.body;
  try {
    const wishlists = await Wishlist.findOneAndUpdate(
      { 'wishes._id': id },
      { $set: { 'wishes.$.itemName': itemName, 'wishes.$.description': description, 'wishes.$.username': username } },
      { new: true }
    );

    if (wishlists) {
      res.status(201).json(wishlists);
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
    const { id } = req.body;

    try {
        const wish = await Wishlist.findOneAndUpdate(
            { 'wishes._id': id },
            { $pull: { wishes: { _id: id } } },
            { new: true }
        );

        if (!wish) {
            return res.status(404).json({
                message: 'Wish not found'
            });
        }

        res.status(200).json(wish);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
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
      
      const wishlists = await Wishlist.findOneAndUpdate({username}, {"$push" : {"wishes" : {"itemName" : itemName, "description" : description, "username" : username}}})
      res.status(201).json(wishlists)
    } catch (error) {
      console.log(error);
      res.status(400)
    }
    
  }]

  module.exports.updatePosition_post = [checkUser, async (req, res) => {
    const { items, username } = req.body;
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { username }, // Query to find the document by username
        { $set: { wishes: items } }, // Update the wishes array with the new items array
        { new: true } // Return the updated document
      );
      if (wishlist) {
        res.status(201).json({ message: 'Wishlist updated successfully' });
      } else {
        console.log('Wishlist not found');
        res.status(404)
      }
    } catch (error) {
      console.log(error);
      res.status(400)
    }
  }];

  module.exports.wishDeclare_post = async (req, res) => {
    const { itemName, username, description } = req.body;
    try {
      
      const wishlists = await Wishlist.create({username})
      res.status(201).json(wishlists)
    } catch (error) {
      console.log(error);
      res.status(400)
    }
    
  }


  module.exports.id_get = [checkUser, async (req,res) => {
    const id = req.params.id
    const list = await Wishlist.find({username:id}).sort({createdAt: +1})
    const wishlists = () =>
              res.render('target', {wish: list})
          wishlists()
          }]
  
  
          module.exports.admin_get = (req, res) => {
            res.render('admin')
          }

module.exports.veileder_get = (req,res) => {
  res.render('veileder')
}
          