const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

// Récupérer toutes les transactions
router.get('/transactions', TransactionController.getAll);

// Récupérer les transactions d’un utilisateur
router.get('/transactions/user/:userId', TransactionController.listByUser);

// Créer une transaction manuelle (ex: pour tests)
router.post('/transactions', TransactionController.create);

module.exports = router;
