const {ExchangeRate,User} = require('../models')

class ExchangeRateController {
  // Créer un taux de change
  async create(req, res) {
    try {

      const { fromCurrency, toCurrency, rate } = req.body;
      const exchangeRate = await ExchangeRate.create({
        fromCurrency,
        toCurrency,
        rate,
      });
      res.status(201).json(exchangeRate);
    } catch (error) {
      res.status(500).json({ error: error.message, details: error.errors });    
    }
  }

  // Lister tous les taux de change
  async list(req, res) {
    try {
      const exchangeRates = await ExchangeRate.findAll();
      res.json(exchangeRates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir un taux de change spécifique
  async getByCurrencies(req, res) {
    try {
      const { fromCurrency, toCurrency } = req.params;
      const exchangeRate = await ExchangeRate.findAll({
        where: { fromCurrency, toCurrency },
      });
      if (!exchangeRate) {
        return res.status(404).json({ message: 'Taux de change introuvable' });
      }
      res.json(exchangeRate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ExchangeRateController();
