const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Wishlist = require('../models/Wishlist')
const { requireAuth, checkUser, checkAdmin } = require('../middleware/authMiddleware');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { password: '', username: ''};

  // duplicate email error
if (err.message === 'incorrect username') {
  errors.username = 'That username is not registered'
}
if (err.message === 'incorrect password') {
  errors.password = 'That password is incorrect'
}
  if (err.code === 11000) {
    if(err.message.includes('username_1 dup key:')) {
      errors.username = 'that user name is already taken'
    }
    return errors;
  }
  // validation errors
  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { password, username } = req.body;

  try {
    const user = await User.create({ password, username });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, username: user.username });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id, username: user.username });
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
    
}
