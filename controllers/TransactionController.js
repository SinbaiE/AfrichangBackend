const { Transaction, Wallet, User, sequelize, Op } = require("../models")
const { v4: uuidv4 } = require("uuid")

class TransactionController {
  // Obtenir les transactions d'un utilisateur
  async getUserTransactions(req, res) {
    try {
      // console.log(req)
      // process.exit()
      const userId = req.userId || req.user.userId
      const { page = 1, limit = 20, type, status, currency } = req.query

      const whereClause = { userId }
      //possibilité de trier en fonction des types ou de status et currency
      if (type) whereClause.type = type
      if (status) whereClause.status = status
      if (currency) whereClause.currency = currency.toUpperCase()

      const offset = (page - 1) * limit
      const transactions = await Transaction.findAndCountAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
        limit: Number.parseInt(limit),
        offset: Number.parseInt(offset),
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "FirstName", "email"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["id", "FirstName", "email"],
          },
        ],
      })

      res.json({
        transactions: transactions.rows,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(transactions.count / limit),
          totalItems: transactions.count,
          itemsPerPage: Number.parseInt(limit),
        },
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Obtenir une transaction par ID
  async getTransaction(req, res) {
    try {
      const { id } = req.params
      const userId = req.userId

      const transaction = await Transaction.findOne({
        where: {
          id,
          userId,
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "FirstName", "email"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["id", "FirstName", "email"],
          },
        ],
      })

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction introuvable",
        })
      }

      res.json(transaction)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Créer un transfert interne
async createTransfer(req, res) {
  try {
    const { phone, amount, currency, description } = req.body;
    const senderId = req.userId;
    // Vérification de base des champs
    if (!phone || !amount || !currency) {
      return res.status(400).json({ message: "Les champs 'phone', 'amount' et 'currency' sont obligatoires." });
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Le montant doit être un nombre positif valide." });
    }
    
    // Trouver le destinataire
    const receiver = await User.findOne({ where: { phone } });
    if (!receiver) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec ce numéro de téléphone." });
    }
    
    if (receiver.id === senderId) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous transférer de l'argent à vous-même." });
    }
    
    // Vérifier le portefeuille de l'expéditeur
    const senderWallet = await Wallet.findOne({
      where: {
        userId: senderId,
        currency: currency.toUpperCase(),
      },
    });
    
    if (!senderWallet) {
      return res.status(404).json({ message: `Aucun portefeuille ${currency} trouvé pour l'expéditeur.` });
    }
    
    if (parseFloat(senderWallet.balance) < parsedAmount) {
      return res.status(400).json({ message: "Fonds insuffisants dans votre portefeuille." });
    }
    
    // Trouver ou créer le portefeuille du destinataire
    let receiverWallet = await Wallet.findOne({
      where: {
        userId: receiver.id,
        currency: currency.toUpperCase(),
      },
    });
    
    if (!receiverWallet) {
      receiverWallet = await Wallet.create({
        userId: receiver.id,
        currency: currency.toUpperCase(),
        balance: 0.0,
      });
    }
    
    // Calcul des frais
    const feeRate = 0.01;
    const fees = parsedAmount * feeRate;
    const netAmount = parsedAmount - fees;
    const reference = `TXN_${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Début de la transaction
    const dbTransaction = await sequelize.transaction();
    
    try {
      // Mise à jour portefeuille expéditeur
      await senderWallet.update(
        { balance: parseFloat(senderWallet.balance) - parsedAmount },
        { transaction: dbTransaction }
      );
      
      // Mise à jour portefeuille destinataire
      await receiverWallet.update(
        { balance: parseFloat(receiverWallet.balance) + netAmount },
        { transaction: dbTransaction }
      );
      
      // Création transaction expéditeur
      const senderTransaction = await Transaction.create(
        {
          userId: senderId,
          walletId: senderWallet.id,
          type: "transfer",
          amount: -parsedAmount,
          currency: currency.toUpperCase(),
          status: "completed",
          reference,
          senderId,
          receiverId: receiver.id,
          fees,
          processedAt: new Date(),
        },
        { transaction: dbTransaction }
      );
      
      // Création transaction destinataire
    const receverTransaction =  await Transaction.create(
        {
          userId: receiver.id,
          walletId: receiverWallet.id,
          type: "transfer",
          amount: netAmount,
          currency: currency.toUpperCase(),
          status: "completed",
          description: description || `Transfert de ${req.userDetails?.name || "Utilisateur"}`,
          reference,
          senderId,
          receiverId: receiver.id,
          fees: 0,
          processedAt: new Date(),
        },
        { transaction: dbTransaction }
      );
      
      // console.log(receverTransaction)
      // process.exit()
      // ✅ Commit final
      await dbTransaction.commit();
      
      return res.json({
        message: "Transfert effectué avec succès",
        transaction: {
          id: senderTransaction.id,
          reference,
          amount: parsedAmount,
          currency: currency.toUpperCase(),
          fees,
          netAmount,
          receiver: {
            name: receiver.name,
            email: receiver.email,
          },
        },
      });

    } catch (error) {
      await dbTransaction.rollback();
      console.error("Erreur pendant la transaction :", error);
      return res.status(500).json({ message: "Erreur interne lors du transfert." });
    }

  } catch (err) {
    console.error("Erreur dans createTransfer :", err);
    return res.status(500).json({ error: err.message || "Erreur serveur." });
  }
}


  // Obtenir les statistiques des transactions
  async getTransactionStats(req, res) {
    try {
      const userId = req.userId
      const { period = "30d" } = req.query
      
      let dateFilter = {}
      const now = new Date()

      // switch (period) {
      //   case "7d":
      //     dateFilter = {
      //       createdAt: {
      //         [Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      //       },
      //     }
      //     break
      //   case "30d":
      //     dateFilter = {
      //       createdAt: {
      //         [Op.gte]: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      //       },
      //     }
      //     break
      //     case "90d":
      //       dateFilter = {
      //         createdAt: {
      //           [Op.gte]: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      //         },
      //       }
      //       break
      //     }
      
      const stats = await Transaction.findAll({
        where: {
          userId,
          // stats
        },
        attributes: [
          "type",
          "status",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
          [sequelize.fn("SUM", sequelize.fn("ABS", sequelize.col("amount"))), "totalAmount"],
        ],
        group: ["type", "status"],
      })
      
      // console.log(stats)
      // process.exit()
      const summary = {
        totalTransactions: 0,
        totalVolume: 0,
        byType: {},
        byStatus: {},
      }

      stats.forEach((stat) => {
        const count = Number.parseInt(stat.dataValues.count)
        const amount = Number.parseFloat(stat.dataValues.totalAmount) || 0

        summary.totalTransactions += count
        summary.totalVolume += Math.abs(amount)

        if (!summary.byType[stat.type]) {
          summary.byType[stat.type] = { count: 0, amount: 0 }
        }
        summary.byType[stat.type].count += count
        summary.byType[stat.type].amount += Math.abs(amount)

        if (!summary.byStatus[stat.status]) {
          summary.byStatus[stat.status] = { count: 0, amount: 0 }
        }
        summary.byStatus[stat.status].count += count
        summary.byStatus[stat.status].amount += Math.abs(amount)
      })

      res.json(summary)
    } catch (err) {
      res.status(500).json({ error: err.message ,err:'la vie de djoniec'})
    }
  }
}

module.exports = new TransactionController()



// const db = require('../models/transaction.mdel');
// const Transaction = db.Transaction;

// class TransactionController {
//   async listByUser(req, res) {
//     try {
//       const { userId } = req.params;
//       const transactions = await Transaction.findAll({
//         where: { userId },
//         order: [['createdAt', 'DESC']],
//       });
//       res.json(transactions);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async create(req, res) {
//     try {
//       const { userId, type, amount, currency, description, senderId, receiverId } = req.body;
//       const transaction = await Transaction.create({
//         userId,
//         type,
//         amount,
//         currency,
//         description,
//         senderId,
//         receiverId,
//         status: 'completed',
//       });
//       res.status(201).json(transaction);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getAll(req, res) {
//     try {
//       const transactions = await Transaction.findAll({
//         order: [['createdAt', 'DESC']],
//       });
//       res.json(transactions);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = new TransactionController();
