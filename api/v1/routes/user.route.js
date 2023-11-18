const express = require('express')
const router = express.Router()

const controller = require('../controllers/user.controller.js')

const authMiddleware = require('../middlewares/auth.middleware.js')

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/password/forgot', controller.forgotPassword)

router.post('/password/otp', controller.otpPassword)

router.post('/password/reset', controller.resetPassword)

router.get('/detail', authMiddleware.requestAuth, controller.detail)

router.get('/list', authMiddleware.requestAuth, controller.list)

module.exports = router