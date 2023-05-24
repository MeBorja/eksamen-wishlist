const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: ".env" });
const authRoutes = require("./routes/authRoutes")
const defaultRoutes = require('./routes/defaultRoutes')
const cookiePraser = require('cookie-parser');
const { requireAuth, checkUser, checkAdmin } = require('./middleware/authMiddleware');
const { collection } = require('./models/Wishlist');
const port = 3000

const app = express();

(async () => {
  try {
    
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log("Connected to DB");
    app.listen(port)
    console.log(`Listening to port: ${port}`);


    app.use(cookiePraser())
    
    app.use(express.static('public'));
    app.use(express.json())
    app.set('view engine', 'ejs');
    
    app.use(authRoutes)
    app.use(defaultRoutes)

    app.get('*', (req, res) => res.render('404'))
   console.log("Good to go");
  } catch (error) {
    console.log(`Error: ${error}`);
    
  }
})();
// middleware;

// view engine


// database connection



// routes
