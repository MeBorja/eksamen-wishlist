const { Router } = require('express')
const authController = require('../controller/authController')
const defaultController = require('../controller/defaultController')
const { requireAuth, checkUser, checkAdmin } = require('../middleware/authMiddleware');
const router = Router()
const { collection } = require('../models/Wishlist');



router.get('*', checkUser )
router.get('/', defaultController.main_get);
router.get('/404' ,(req, res) => res.render('404'))
router.get('/wishlist', requireAuth, (req, res) => res.render('wishlist'))
router.post('/wishlist', defaultController.wishlist_post)
router.get('/user/:id', defaultController.id_get)
router.get('/home/:id', defaultController.homeUser_get)
router.post('/updateWish', defaultController.updateWish_post)
router.post('/deleteWish', defaultController.deleteWish_post)




module.exports = router