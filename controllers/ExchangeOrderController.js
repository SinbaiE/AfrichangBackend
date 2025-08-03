const db = require('../models');
const ExchangeOrder = db.ExchangeOrder;

class ExchangeOrderController {
  // Lister toutes les commandes d’échange
  async listAll(req, res) {
    try {
      const orders = await ExchangeOrder.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json(orders);
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
