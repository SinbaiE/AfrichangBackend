const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.post('/users', UserController.create);
router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.destroy);

module.exports = router;
