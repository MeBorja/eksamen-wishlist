const { Router } = require('express')
const authController = require('../controller/authController')
const { requireAuth, checkUser, checkAdmin } = require('../middleware/authMiddleware');

const router = Router()


router.get('*', checkUser )
router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login' , authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)
router.get('/admin', checkAdmin, authController.admin_get )



module.exports = router