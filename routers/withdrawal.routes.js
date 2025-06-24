const express = require('express');
const router = express.Router();
const WithdrawalController = require('../controllers/WithdrawalController');

// Créer un retrait
router.post('/withdrawals', WithdrawalController.create);

// Lister les retraits d’un utilisateur
router.get('/withdrawals/user/:userId', WithdrawalController.listByUser);

// Mettre à jour le statut d’un retrait
router.put('/withdrawals/:id/status', WithdrawalController.updateStatus);

module.exports = router;
