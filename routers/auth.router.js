const express = require('express');
const loginController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/auth',loginController.login);

module.exports = authRouter;