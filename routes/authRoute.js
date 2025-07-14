const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const express = require('express')
const route = express.Router()

route.post('/register', authMiddleware.checkUsernameExist, authController.register)
route.post('/login', authMiddleware.checkBeforeLogin, authController.login)

module.exports = route