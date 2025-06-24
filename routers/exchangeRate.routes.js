const express = require('express');
const router = express.Router();
const ExchangeRateController = require('../controllers/ExchangeRateController');

// Créer un taux de change
router.post('/exchange-rates', ExchangeRateController.create);

// Lister tous les taux de change
router.get('/exchange-rates', ExchangeRateController.list);

// Obtenir un taux de change spécifique
router.get('/exchange-rates/:fromCurrency/:toCurrency', ExchangeRateController.getByCurrencies);

module.exports = router;
