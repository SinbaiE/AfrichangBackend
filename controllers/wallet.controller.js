const { Wallet, User, Transaction, sequelize } = require("../models")

class WalletController {
  // Récupérer tous les portefeuilles d'un utilisateur
  async getUserWallets(req, res) {
    try {
      const userId = req.userId

      const wallets = await Wallet.findAll({
        where: { userId, isActive: true },
        order: [["currency", "ASC"]],
        include: [
          {
            model: User,
            attributes: ["id", "FirstName", "email"],
          },
        ],
      })

      res.json(wallets)
    } catch (err) {
      console.error("Erreur getUserWallets:", err)
      res.status(500).json({
        error: "Erreur lors de la récupération des portefeuilles",
        message: err.message,
      })
    }
  }

  // Récupérer un portefeuille spécifique par devise
  async getWalletByCurrency(req, res) {
    try {
      const { currency,id } = req.params
      console.log(req.params)
      const wallet = await Wallet.findOne({
        where: {
          userId:id,
          currency: currency.toUpperCase(),
          isActive: true,
        },
        include: [
          {
            model: User,
            attributes: ["id", "FirstName", "email"],
          },
        ],
      })

      if (!wallet) {
        return res.status(404).json({
          message: "Portefeuille introuvable pour cette devise",
        })
      }

      res.json(wallet)
    } catch (err) {
      console.error("Erreur getWalletByCurrency:", err)
      res.status(500).json({
        error: "Erreur lors de la récupération du portefeuille",
        message: err.message,
      })
    }
  }

  // Créer un nouveau portefeuille
  async createWallet(req, res) {
    try {
      const { currency } = req.body
      const userId = req.params.id

      if (!currency) {
        return res.status(400).json({
          message: "La devise est requise",
        })
      }

      // Vérifier si le portefeuille existe déjà
      const existingWallet = await Wallet.findOne({
        where: {
          userId,
          currency: currency.toUpperCase(),
        },
      })

      if (existingWallet) {
        return res.status(400).json({
          message: `Vous avez déjà un portefeuille pour ${currency}`,
        })
      }
      console.log(userId)
      // Valider la devise
      const supportedCurrencies = ["XOF", "XAF", "NGN", "GHS", "KES", "UGX", "TZS", "ZAR"]
      if (!supportedCurrencies.includes(currency.toUpperCase())) {
        return res.status(400).json({
          message: `La devise ${currency} n'est pas supportée`,
        })
      }

      const wallet = await Wallet.create({
        userId,
        currency: currency.toUpperCase(),
        balance: 0.0,
        isActive: true,
      })

      res.status(201).json({
        message: "Portefeuille créé avec succès",
        wallet,
      })
    } catch (err) {
      console.error("Erreur createWallet:", err)
      res.status(500).json({
        error: "Erreur lors de la création du portefeuille",
        message: err.message,
      })
    }
  }

  // Obtenir le solde d'un portefeuille
  async getWalletBalance(req, res) {
    try {
      const { currency,id } = req.params

      const wallet = await Wallet.findOne({
        where: {
          userId:id,
          currency: currency.toUpperCase(),
          isActive: true,
        },
      })

      if (!wallet) {
        return res.status(404).json({
          message: `Aucun portefeuille trouvé pour la devise ${currency}`,
        })
      }

      res.json({
        currency: wallet.currency,
        balance: Number.parseFloat(wallet.balance),
        lastUpdated: wallet.updatedAt,
        lastTransactionAt: wallet.lastTransactionAt,
      })
    } catch (err) {
      console.error("Erreur getWalletBalance:", err)
      res.status(500).json({
        error: "Erreur lors de la récupération du solde",
        message: err.message,
      })
    }
  }

  // Obtenir les statistiques des portefeuilles
  async getWalletStats(req, res) {
    try {
      const {id} = req.params
      console.log(id)
      const wallets = await Wallet.findAll({
        where: { userId:id, isActive: true },
        attributes: ["currency", "balance", "lastTransactionAt", "updatedAt"],
      })

      const stats = {
        totalWallets: wallets.length,
        totalBalance: wallets.reduce((sum, wallet) => sum + Number.parseFloat(wallet.balance), 0),
        currencies: wallets.map((wallet) => wallet.currency),
        lastActivity: wallets.reduce((latest, wallet) => {
          const walletDate = wallet.lastTransactionAt || wallet.updatedAt
          return !latest || walletDate > latest ? walletDate : latest
        }, null),
      }

      res.json(stats)
    } catch (err) {
      console.error("Erreur getWalletStats:", err)
      res.status(500).json({
        error: "Erreur lors de la récupération des statistiques",
        message: err.message,
      })
    }
  }
}

module.exports = new WalletController()



// const { Wallet, User } = require('../models');

// class WalletController {
//     // Récupérer tous les portefeuilles d'un utilisateur
//     async getUserWallets(req, res) {
//       try {
//         const userId = req.params.userId;
        
//         const wallets = await Wallet.findAll({ where: { userId } });
//         // res.status(200).json({wallets});
//         if (!wallets.length) return res.status(404).json({ message: 'Aucun portefeuille trouvé pour cet utilisateur' });
//         res.json(wallets);
//       } catch (err) {
//         res.status(500).json({ error: err.message , details:err.errors });
//       }
//     }
    
//     // Récupérer un portefeuille spécifique par utilisateur et devise
//     async getWalletByCurrency(req, res) {
//       try {
//         const { userId, currency } = req.params;
//         // res.status(400).json({message:'la vie de nous jour',userId ,currency});
//         const wallet = await Wallet.findOne({ where: { userId, currency } });
//         if (!wallet) return res.status(404).json({ message: 'Portefeuille introuvable' });
//         res.json(wallet);
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     }

//     // Dépôt d'argent dans le portefeuille
//     async deposit(req, res) {
//       try {
//         console.log(req.body);
//         const { userId, currency } = req.params;
//         const { amount } = req.body;

//         if (amount <= 0) 
//           return res.status(400).json({ message: 'Le montant à déposer doit être supérieur à zéro.' });

//         const wallet = await Wallet.findOne({ where: { userId, currency } });
//         if (!wallet) return res.status(404).json({ message: 'Portefeuille introuvable' });

//         wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
//         await wallet.save();

//         res.json({ message: `Dépôt de ${amount} ${currency} effectué. Nouveau solde : ${wallet.balance}` });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     }

//     // Retrait d'argent du portefeuille
//     async withdraw(req, res) {
//       try {
//         const { userId, currency } = req.params;
//         const { amount } = req.body;

//         if (amount <= 0) return res.status(400).json({ message: 'Le montant à retirer doit être supérieur à zéro.' });

//         const wallet = await Wallet.findOne({ where: { userId, currency } });

//         if (!wallet) return res.status(404).json({ message: 'Portefeuille introuvable' });

//         if (wallet.balance < amount) return res.status(400).json({ message: 'Fonds insuffisants dans ce portefeuille.' });

//         wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
//         await wallet.save();

//         res.json({ message: `Retrait de ${amount} ${currency} effectué. Nouveau solde : ${wallet.balance}` });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     }

//     // Transfert entre deux portefeuilles (devises identiques)
//     async transfer(req, res) {
//       try {
//         const { senderId, receiverId, currency } = req.params;
//         const { amount } = req.body;

//         if (amount <= 0) return res.status(400).json({ message: 'Le montant à transférer doit être supérieur à zéro.' });

//         // Récupérer les portefeuilles de l'expéditeur et du destinataire
//         const senderWallet = await Wallet.findOne({ where: { userId: senderId, currency } });
//         const receiverWallet = await Wallet.findOne({ where: { userId: receiverId, currency } });

//         if (!senderWallet || !receiverWallet) return res.status(404).json({ message: 'Portefeuille de l\'expéditeur ou du destinataire introuvable' });

//         if (senderWallet.balance < amount) return res.status(400).json({ message: 'Fonds insuffisants dans le portefeuille de l\'expéditeur.' });

//         // Effectuer le transfert
//         senderWallet.balance = parseFloat(senderWallet.balance) - parseFloat(amount);
//         receiverWallet.balance = parseFloat(receiverWallet.balance) + parseFloat(amount);

//         await senderWallet.save();
//         await receiverWallet.save();

//         res.json({
//           message: `Transfert de ${amount} ${currency} effectué de l'expéditeur (ID: ${senderId}) vers le destinataire (ID: ${receiverId}).`
//         });
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
//     }
//   }

//   module.exports = new WalletController();

