const express = require("express");
const { body, param } = require("express-validator");
const WalletController = require("../controllers/wallet.controller");
const auth = require("../midalwaire/auth.middalwaire");

const router = express.Router()

// Middleware de validation des erreurs
const handleValidationErrors = (req, res, next) => {
  const errors = require("express-validator").validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Données invalides",
      errors: errors.array(),
    })
  }
  next()
}

// Validation rules
const currencyValidation = [
  param("currency").isAlpha().isLength({ min: 3, max: 3 }).withMessage("Code devise invalide").toUpperCase(),
]

const createWalletValidation = [
  body("currency").isAlpha().isLength({ min: 3, max: 3 }).withMessage("Code devise invalide").toUpperCase(),
]

// Routes (toutes nécessitent une authentification)
router.use(auth)

// GET /api/wallets - Récupérer tous les portefeuilles de l'utilisateur
router.get("/wallets", WalletController.getUserWallets)

// GET /api/wallets/:currency - Récupérer un portefeuille par devise
router.get("/wallets/:id/:currency", currencyValidation, handleValidationErrors, WalletController.getWalletByCurrency)

// POST /api/wallets - Créer un nouveau portefeuille
router.post("/wallets/:id", createWalletValidation, handleValidationErrors, WalletController.createWallet)

// GET /api/wallets/:currency/balance - Obtenir le solde d'un portefeuille
router.get("/wallets/:currency/balance/:id", currencyValidation, handleValidationErrors, WalletController.getWalletBalance)

// GET /api/wallets/stats - Obtenir les statistiques des portefeuilles
router.get("/wallets/stats/:id/:currency", WalletController.getWalletStats)

module.exports = router
