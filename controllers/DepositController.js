const db = require('../models/deposit.model');
const Deposit = db.Deposit;

class DepositController {
  // Créer un dépôt
  async create(req, res) {
    try {
      const { userId, amount, currency, paymentMethod } = req.body;
      const deposit = await Deposit.create({
        userId,
        amount,
        currency,
        paymentMethod,
        status: 'pending',
      });
      res.status(201).json(deposit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lister les dépôts d’un utilisateur
  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const deposits = await Deposit.findAll({ where: { userId } });
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour le statut d'un dépôt
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const deposit = await Deposit.findByPk(id);
      if (!deposit) return res.status(404).json({ message: 'Dépôt introuvable' });

      deposit.status = status;
      await deposit.save();
      res.json(deposit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DepositController();
