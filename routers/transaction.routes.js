const express = require("express")
const {body,param} = require('express-validator')
const TransactionController = require("../controllers/TransactionController")
const auth = require("../midalwaire/auth.middalwaire")

const router = express.Router()

// Validation rules
const transferValidation =[
  body("receiverEmail").isEmail().withMessage("Email du destinataire invalide"),
  body("amount").isFloat({ min: 0.01 }).withMessage("Montant invalide"),
  body("currency").isAlpha().isLength({ min: 3, max: 3 }).withMessage("Code devise invalide"),
]

router.use(transferValidation)

router.get("/transactions",auth,  TransactionController.getUserTransactions)
router.get("/transactions/:id",auth,  TransactionController.getTransaction)
router.get("/transactions/single/:id",auth,  TransactionController.getTransaction)
router.post("/transactions/transfer",auth,  TransactionController.createTransfer)
router.get("/transactions/statistique/stats",auth,  TransactionController.getTransactionStats)

module.exports = router




// const express = require('express');
// const router = express.Router();
// const TransactionController = require('../controllers/TransactionController');

// // Récupérer toutes les transactions
// router.get('/transactions', TransactionController.getTransaction);

// // Récupérer les transactions d’un utilisateur
// router.get('/transactions/user/:userId', TransactionController.listByUser);

// // Créer une transaction manuelle (ex: pour tests)
// router.post('/transactions', TransactionController.create);

// module.exports = router;
