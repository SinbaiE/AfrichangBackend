const db = require('../models/transaction.mdel');
const Transaction = db.Transaction;

class TransactionController {
  async listByUser(req, res) {
    try {
      const { userId } = req.params;
      const transactions = await Transaction.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { userId, type, amount, currency, description, senderId, receiverId } = req.body;
      const transaction = await Transaction.create({
        userId,
        type,
        amount,
        currency,
        description,
        senderId,
        receiverId,
        status: 'completed',
      });
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const transactions = await Transaction.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TransactionController();
