const express = require('express');
const loginController = require('../controllers/auth.controller');

const authRouter = express.Router();
authRouter.post('/auth',loginController.login);

module.exports = authRouter;


// const express = require("express")
// const { body } = require("express-validator")
// const AuthController = require("../controllers/AuthController")
// const auth = require("../middleware/auth")

// const router = express.Router()

// // Validation rules
// const registerValidation = [
//   body("name").trim().isLength({ min: 2 }).withMessage("Le nom doit contenir au moins 2 caractères"),
//   body("email").isEmail().withMessage("Email invalide"),
//   body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
//   body("phone").isMobilePhone().withMessage("Numéro de téléphone invalide"),
//   body("country").trim().isLength({ min: 2 }).withMessage("Pays requis"),
// ]

// const loginValidation = [
//   body("email").isEmail().withMessage("Email invalide"),
//   body("password").notEmpty().withMessage("Mot de passe requis"),
// ]

// const changePasswordValidation = [
//   body("currentPassword").notEmpty().withMessage("Mot de passe actuel requis"),
//   body("newPassword").isLength({ min: 6 }).withMessage("Le nouveau mot de passe doit contenir au moins 6 caractères"),
// ]

// // Routes
// router.post("/register", registerValidation, AuthController.register)
// router.post("/login", loginValidation, AuthController.login)
// router.get("/me", auth, AuthController.getMe)
// router.put("/profile", auth, AuthController.updateProfile)
// router.put("/change-password", auth, changePasswordValidation, AuthController.changePassword)
// router.post("/logout", auth, AuthController.logout)

// module.exports = router
