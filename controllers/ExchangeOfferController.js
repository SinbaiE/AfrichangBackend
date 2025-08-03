const db = require('../models');
const { ExchangeOffer, Wallet, ExchangeOrder } = db;
const sequelize = db.sequelize;

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

  // Accepter une offre et exécuter l'échange
  async accept(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { userId: acceptorId } = req.body; // ID de l'utilisateur qui accepte l'offre

      const offer = await ExchangeOffer.findByPk(id, { transaction, lock: true });

      if (!offer) {
        await transaction.rollback();
        return res.status(404).json({ message: "Offre introuvable." });
      }

      if (offer.status !== 'open') {
        await transaction.rollback();
        return res.status(400).json({ message: "L'offre n'est plus disponible." });
      }

      const sellerId = offer.userId;
      if (sellerId === acceptorId) {
        await transaction.rollback();
        return res.status(400).json({ message: "Vous ne pouvez pas accepter votre propre offre." });
      }

      const amountToExchange = offer.amount;
      const targetAmount = amountToExchange * offer.rate;

      const sellerFromWallet = await Wallet.findOne({ where: { userId: sellerId, currency: offer.fromCurrency }, transaction });
      const acceptorToWallet = await Wallet.findOne({ where: { userId: acceptorId, currency: offer.toCurrency }, transaction });

      if (!sellerFromWallet || sellerFromWallet.balance < amountToExchange) {
        await transaction.rollback();
        return res.status(400).json({ message: "Le vendeur n'a pas les fonds suffisants." });
      }

      if (!acceptorToWallet || acceptorToWallet.balance < targetAmount) {
        await transaction.rollback();
        return res.status(400).json({ message: "L'acheteur n'a pas les fonds suffisants." });
      }

      const sellerToWallet = await Wallet.findOne({ where: { userId: sellerId, currency: offer.toCurrency }, transaction });
      const acceptorFromWallet = await Wallet.findOne({ where: { userId: acceptorId, currency: offer.fromCurrency }, transaction });

      // Exécution de l'échange
      await sellerFromWallet.decrement('balance', { by: amountToExchange, transaction });
      await acceptorFromWallet.increment('balance', { by: amountToExchange, transaction });

      await acceptorToWallet.decrement('balance', { by: targetAmount, transaction });
      await sellerToWallet.increment('balance', { by: targetAmount, transaction });

      // Mise à jour du statut de l'offre
      offer.status = 'matched';
      offer.matchedWith = acceptorId;
      await offer.save({ transaction });

      // Création de l'ordre d'échange comme archive
      await ExchangeOrder.create({
        userId: sellerId,
        fromCurrency: offer.fromCurrency,
        toCurrency: offer.toCurrency,
        amount: offer.amount,
        rate: offer.rate,
        status: 'completed',
        matchedWith: acceptorId,
      }, { transaction });

      await transaction.commit();

      res.status(200).json({ message: "Échange réalisé avec succès." });

    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ExchangeOfferController();
