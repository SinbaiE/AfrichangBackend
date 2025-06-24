const { Wallet, User } = require('../models');

class WalletController {
    // Récupérer tous les portefeuilles d'un utilisateur
    async getUserWallets(req, res) {
      try {
        const userId = req.params.userId;
        
        const wallets = await Wallet.findAll({ where: { userId } });
        // res.status(200).json({wallets});
        if (!wallets.length) return res.status(404).json({ message: 'Aucun portefeuille trouvé pour cet utilisateur' });
        res.json(wallets);
      } catch (err) {
        res.status(500).json({ error: err.message , details:err.errors });
      }
    }
    
    // Récupérer un portefeuille spécifique par utilisateur et devise
    async getWalletByCurrency(req, res) {
      try {
        const { userId, currency } = req.params;
        // res.status(400).json({message:'la vie de nous jour',userId ,currency});
        const wallet = await Wallet.findOne({ where: { userId, currency } });
        if (!wallet) return res.status(404).json({ message: 'Portefeuille introuvable' });
        res.json(wallet);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

    // Dépôt d'argent dans le portefeuille
    async deposit(req, res) {
      try {
        const { userId, currency } = req.params;
        const { amount } = req.body;

        if (amount <= 0) return res.status(400).json({ message: 'Le montant à déposer doit être supérieur à zéro.' });

        const wallet = await Wallet.findOne({ where: { userId, currency } });
        if (!wallet) return res.status(404).json({ message: 'Portefeuille introuvable' });

        wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
        await wallet.save();

        res.json({ message: `Dépôt de ${amount} ${currency} effectué. Nouveau solde : ${wallet.balance}` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

    // Retrait d'argent du portefeuille
    async withdraw(req, res) {
      try {
        const { userId, currency } = req.params;
        const { amount } = req.body;

        if (amount <= 0) return res.status(400).json({ message: 'Le montant à retirer doit être supérieur à zéro.' });

        const wallet = await Wallet.findOne({ where: { userId, currency } });

        if (!wallet) return res.status(404).json({ message: 'Portefeuille introuvable' });

        if (wallet.balance < amount) return res.status(400).json({ message: 'Fonds insuffisants dans ce portefeuille.' });

        wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
        await wallet.save();

        res.json({ message: `Retrait de ${amount} ${currency} effectué. Nouveau solde : ${wallet.balance}` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

    // Transfert entre deux portefeuilles (devises identiques)
    async transfer(req, res) {
      try {
        const { senderId, receiverId, currency } = req.params;
        const { amount } = req.body;

        if (amount <= 0) return res.status(400).json({ message: 'Le montant à transférer doit être supérieur à zéro.' });

        // Récupérer les portefeuilles de l'expéditeur et du destinataire
        const senderWallet = await Wallet.findOne({ where: { userId: senderId, currency } });
        const receiverWallet = await Wallet.findOne({ where: { userId: receiverId, currency } });

        if (!senderWallet || !receiverWallet) return res.status(404).json({ message: 'Portefeuille de l\'expéditeur ou du destinataire introuvable' });

        if (senderWallet.balance < amount) return res.status(400).json({ message: 'Fonds insuffisants dans le portefeuille de l\'expéditeur.' });

        // Effectuer le transfert
        senderWallet.balance = parseFloat(senderWallet.balance) - parseFloat(amount);
        receiverWallet.balance = parseFloat(receiverWallet.balance) + parseFloat(amount);

        await senderWallet.save();
        await receiverWallet.save();

        res.json({
          message: `Transfert de ${amount} ${currency} effectué de l'expéditeur (ID: ${senderId}) vers le destinataire (ID: ${receiverId}).`
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  }

  module.exports = new WalletController();

