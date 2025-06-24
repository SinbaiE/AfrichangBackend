const db = require('../models/exchangeorder.model');
const ExchangeOrder = db.ExchangeOrder;

class ExchangeOrderController {
  // Créer une nouvelle commande d’échange
  async create(req, res) {
    try {
      const { userId, fromCurrency, toCurrency, amount, rate } = req.body;
      const order = await ExchangeOrder.create({
        userId,
        fromCurrency,
        toCurrency,
        amount,
        rate,
        status: 'open',
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lister les commandes d’échange ouvertes
  async listOpen(req, res) {
    try {
      const orders = await ExchangeOrder.findAll({ where: { status: 'open' } });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Annuler une commande
  async cancel(req, res) {
    try {
      const { id } = req.params;
      const order = await ExchangeOrder.findByPk(id);
      if (!order || order.status !== 'open') {
        return res.status(404).json({ message: "Commande introuvable ou déjà traitée" });
      }
      order.status = 'cancelled';
      await order.save();
      res.json({ message: 'Commande annulée avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lister les commandes d’un utilisateur
  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const orders = await ExchangeOrder.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ExchangeOrderController();
