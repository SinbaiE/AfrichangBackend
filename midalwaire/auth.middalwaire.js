const jwt = require("jsonwebtoken")
const { User } = require("../models")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    // console.log(token)
    if (!token) {
      return res.status(401).json({
        error: "Accès refusé",
        message: "Aucun token fourni",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Vérifier si l'utilisateur existe toujours
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(401).json({
        error: "Accès refusé",
        message: "Utilisateur introuvable",
      })
    }

    // Vérifier si le compte est actif
    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        error: "Compte suspendu",
        message: "Votre compte a été suspendu",
      })
    }

    // Ajouter les informations utilisateur à la requête
    req.userId = decoded.userId
    req.userEmail = decoded.email
    req.userDetails = user

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Accès refusé",
        message: "Token invalide",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Accès refusé",
        message: "Token expiré",
      })
    }

    console.error("Erreur middleware auth:", error)
    res.status(500).json({
      error: "Erreur d'authentification",
      message: "Une erreur est survenue lors de l'authentification",
    })
  }
}

module.exports = auth






// const jwt = require('jsonwebtoken');
// const config = require('../config/database');

// module.exports = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'Accès interdit. Token manquant.' });

//   try {
//     const decoded = jwt.verify(token, config.jwtSecret);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Token invalide.' });
//   }
// };
