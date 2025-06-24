const express = require('express');
const router = express.Router();
const ExchangeOrderController = require('../controllers/ExchangeOrderController');

// Créer une commande d’échange
router.post('/exchange-orders', ExchangeOrderController.create);

// Lister toutes les commandes ouvertes
router.get('/exchange-orders', ExchangeOrderController.listOpen);

// Lister les commandes d’un utilisateur
router.get('/exchange-orders/user/:userId', ExchangeOrderController.listByUser);

// Annuler une commande
router.delete('/exchange-orders/:id', ExchangeOrderController.cancel);

module.exports = router;

