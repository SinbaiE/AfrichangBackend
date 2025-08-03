const express = require('express');
const router = express.Router();
const ExchangeOfferController = require('../controllers/ExchangeOfferController');

// Créer une offre
router.post('/exchange-offers', ExchangeOfferController.create);

// Lister toutes les offres ouvertes
router.get('/exchange-offers', ExchangeOfferController.listOpen);

// Lister les offres d’un utilisateur
router.get('/exchange-offers/user/:userId', ExchangeOfferController.listByUser);

// Annuler une offre
router.delete('/exchange-offers/:id', ExchangeOfferController.cancel);

// Accepter une offre
router.post('/exchange-offers/:id/accept', ExchangeOfferController.accept);

module.exports = router;
