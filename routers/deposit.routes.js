const express = require("express")
const router = express.Router()
const DepositController = require("../controllers/DepositController")
const auth = require("../midalwaire/auth.middalwaire")

// Toutes les routes nécessitent une authentification
router.use(auth)

// Routes des dépôts
router.get("/deposits:id", DepositController.getUserDeposits)
router.post("/deposits/:id", DepositController.createDeposit)
router.get("/deposits/payment-methods", DepositController.getPaymentMethods)
router.get("/deposits/:depositId/users", DepositController.getDeposit)
router.put("/deposits/:depositId/cancel", DepositController.cancelDeposit)

module.exports = router



// const express = require('express');
// const router = express.Router();
// const DepositController = require('../controllers/DepositController');

// // Créer un dépôt
// router.post('/deposits', DepositController.create);

// // Lister les dépôts d’un utilisateur
// router.get('/deposits/user/:userId', DepositController.listByUser);

// // Mettre à jour le statut d’un dépôt
// router.put('/deposits/:id/status', DepositController.updateStatus);

// module.exports = router;
