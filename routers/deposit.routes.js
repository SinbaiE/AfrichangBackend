const express = require('express');
const router = express.Router();
const DepositController = require('../controllers/DepositController');

// Créer un dépôt
router.post('/deposits', DepositController.create);

// Lister les dépôts d’un utilisateur
router.get('/deposits/user/:userId', DepositController.listByUser);

// Mettre à jour le statut d’un dépôt
router.put('/deposits/:id/status', DepositController.updateStatus);

module.exports = router;
