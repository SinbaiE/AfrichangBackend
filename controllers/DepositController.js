const { Deposit, Wallet, Transaction, PaymentMethod } = require("../models")
const { sequelize } = require("../models")

class DepositController {
  // Récupérer tous les dépôts d'un utilisateur
  async getUserDeposits(req, res) {
    try {
      const userId = req.userId
      const { page = 1, limit = 20, status } = req.query

      const whereClause = { userId }
      if (status) whereClause.status = status

      const deposits = await Deposit.findAndCountAll({
        where: whereClause,
        limit: Number.parseInt(limit),
        offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: PaymentMethod,
            attributes: ["id", "name", "type"],
          },
        ],
        include:[
          {
            model:Wallet,
            attributes:["id","currency","balance"],
          }
        ],
      })

      res.json({
        deposits: deposits.rows,
        totalCount: deposits.count,
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(deposits.count / Number.parseInt(limit)),
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Créer un nouveau dépôt
  async createDeposit(req, res) {
    const transaction = await sequelize.transaction()

    try {
      const { currency, amount, paymentMethod } = req.body
      const userId = req.params

      if (amount <= 0) {
        return res.status(400).json({ message: "Le montant doit être supérieur à zéro" })
      }

      // Vérifier que la méthode de paiement existe
      const paymentMethodRecord = await PaymentMethod.findByPk(paymentMethod)
      if (!paymentMethodRecord) {
        return res.status(404).json({ message: "Méthode de paiement introuvable" })
      }

      // Créer le dépôt
      const deposit = await Deposit.create(
        {
          userId,
          currency,
          amount,
          paymentMethodId: paymentMethod,
          status: "pending",
          reference: `DEP-${Date.now()}-${userId}`,
        },
        { transaction },
      )

      // Créer ou récupérer le portefeuille
      let wallet = await Wallet.findOne(
        {
          where: { userId, currency },
        },
        { transaction },
      )

      if (!wallet) {
        wallet = await Wallet.create(
          {
            userId,
            currency,
            balance: 0,
          },
          { transaction },
        )
      }

      // Pour la démo, on approuve automatiquement le dépôt
      // En production, cela nécessiterait une vérification de paiement
      deposit.status = "completed"
      wallet.balance = Number.parseFloat(wallet.balance) + Number.parseFloat(amount)

      await deposit.save({ transaction })
      await wallet.save({ transaction })

      // Créer la transaction correspondante
      const depositTransaction = await Transaction.create(
        {
          userId: userId,
          type: "deposit",
          amount,
          currency,
          status: "completed",
          description: `Dépôt via ${paymentMethodRecord.name}`,
          senderId: userId,
          receiverId: userId,
          reference: `DEP-${Date.now()}-${userId}`,
        },
        { transaction },
      )

      await transaction.commit()

      res.status(201).json({
        message: "Dépôt effectué avec succès",
        deposit,
        transaction: depositTransaction,
      })
    } catch (err) {
      await transaction.rollback()
      res.status(500).json({ error: err.message })
    }
  }

  // Obtenir un dépôt spécifique
  async getDeposit(req, res) {
    try {
      const { depositId } = req.params
      const userId = req.userId

      const deposit = await Deposit.findOne({
        where: { id: depositId, userId },
        include: [
          {
            model: PaymentMethod,
            attributes: ["id", "name", "type"],
          },
        ],
      })

      if (!deposit) {
        return res.status(404).json({ message: "Dépôt introuvable" })
      }

      res.json(deposit)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Annuler un dépôt en attente
  async cancelDeposit(req, res) {
    try {
      const { depositId } = req.params
      const userId = req.userId

      const deposit = await Deposit.findOne({
        where: { id: depositId, userId },
      })

      if (!deposit) {
        return res.status(404).json({ message: "Dépôt introuvable" })
      }

      if (deposit.status !== "pending") {
        return res.status(400).json({ message: "Seuls les dépôts en attente peuvent être annulés" })
      }

      deposit.status = "cancelled"
      await deposit.save()

      res.json({
        message: "Dépôt annulé avec succès",
        deposit,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Obtenir les méthodes de paiement disponibles
  async getPaymentMethods(req, res) {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        where: { isActive: true },
        order: [["name", "ASC"]],
      })

      res.json(paymentMethods)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

module.exports = new DepositController()



// const db = require('../models/deposit.model');
// const Deposit = db.Deposit;

// class DepositController {
//   // Créer un dépôt
//   async create(req, res) {
//     try {
//       const { userId, amount, currency, paymentMethod } = req.body;
//       const deposit = await Deposit.create({
//         userId,
//         amount,
//         currency,
//         paymentMethod,
//         status: 'pending',
//       });
//       res.status(201).json(deposit);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // Lister les dépôts d’un utilisateur
//   async listByUser(req, res) {
//     try {
//       const { userId } = req.params;
//       const deposits = await Deposit.findAll({ where: { userId } });
//       res.json(deposits);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // Mettre à jour le statut d'un dépôt
//   async updateStatus(req, res) {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;
//       const deposit = await Deposit.findByPk(id);
//       if (!deposit) return res.status(404).json({ message: 'Dépôt introuvable' });

//       deposit.status = status;
//       await deposit.save();
//       res.json(deposit);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = new DepositController();
