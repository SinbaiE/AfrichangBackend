const db = require('../models/withdrawal.model');
const Withdrawal = db.Withdrawal;

class WithdrawalController {
  // Créer un retrait
  async create(req, res) {
    try {
      const { userId, amount, currency, paymentMethod } = req.body;
      const withdrawal = await Withdrawal.create({
        userId,
        amount,
        currency,
        paymentMethod,
        status: 'pending',
      });
      res.status(201).json(withdrawal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lister les retraits d’un utilisateur
  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const withdrawals = await Withdrawal.findAll({ where: { userId } });
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour le statut d'un retrait
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const withdrawal = await Withdrawal.findByPk(id);
      if (!withdrawal) return res.status(404).json({ message: 'Retrait introuvable' });

      withdrawal.status = status;
      await withdrawal.save();
      res.json(withdrawal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WithdrawalController();
