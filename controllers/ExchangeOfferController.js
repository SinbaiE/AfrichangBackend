const db = require('../models/exchangeoffer.model');
const ExchangeOffer = db.ExchangeOffer;

class ExchangeOfferController {
  // Créer une nouvelle offre
  async create(req, res) {
    try {
      const { userId, fromCurrency, toCurrency, amount, rate } = req.body;
      const offer = await ExchangeOffer.create({
        userId,
        fromCurrency,
        toCurrency,
        amount,
        rate,
        status: 'open',
      });
      res.status(201).json(offer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Liste des offres ouvertes
  async listOpen(req, res) {
    try {
      const offers = await ExchangeOffer.findAll({ where: { status: 'open' } });
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Annuler une offre
  async cancel(req, res) {
    try {
      const { id } = req.params;
      const offer = await ExchangeOffer.findByPk(id);
      if (!offer || offer.status !== 'open') {
        return res.status(404).json({ message: "Offre introuvable ou déjà traitée" });
      }
      offer.status = 'cancelled';
      await offer.save();
      res.json({ message: 'Offre annulée avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lister les offres d’un utilisateur
  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const offers = await ExchangeOffer.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ExchangeOfferController();
