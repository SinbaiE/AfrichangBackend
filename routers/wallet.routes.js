const express = require('express');
const router = express.Router();
const WalletController = require('../controllers/wallet.controller');

// Récupérer tous les portefeuilles d'un utilisateur
router.get('/wallets/:userId', WalletController.getUserWallets);

// Récupérer un portefeuille spécifique par devise
router.get('/wallets/:userId/:currency', WalletController.getWalletByCurrency);

// Déposer de l'argent dans un portefeuille
router.post('/wallets/:userId/:currency/deposit', WalletController.deposit);

// Retirer de l'argent d'un portefeuille
router.post('/wallets/:userId/:currency/withdraw', WalletController.withdraw);

// Transférer de l'argent entre deux portefeuilles
router.post('/wallets/:senderId/transfer/:receiverId/:currency', WalletController.transfer);



module.exports = router;
