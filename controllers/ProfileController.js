const { User, UserSettings, Transaction, Wallet, sequelize } = require("../models")

class ProfileController {
  // Obtenir les statistiques du profil utilisateur

  async getProfileStats(req, res) {
    try {
      const userId = req.userId

      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      })

      if (!user) {
        return res.status(404).json({
          message: "Utilisateur introuvable",
        })
      }

      // Obtenir les statistiques des transactions
      const transactionStats = await Transaction.findAll({
        where: { userId },
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
          [sequelize.fn("SUM", sequelize.fn("ABS", sequelize.col("amount"))), "totalVolume"],
        ],
      })

      // Obtenir le nombre de portefeuilles
      const walletCount = await Wallet.count({
        where: { userId },
      })

      const stats = {
        totalTransactions: Number.parseInt(transactionStats[0]?.dataValues?.totalTransactions || 0),
        totalVolume: Number.parseFloat(transactionStats[0]?.dataValues?.totalVolume || 0),
        walletCount,
        joinDate: user.createdAt,
        lastLogin: user.lastLogin,
        verificationLevel: user.kycStatus === "verified" ? "Vérifié" : "En attente",
        accountStatus: user.accountStatus === "active" ? "Actif" : user.accountStatus,
      }

      res.json(stats)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Obtenir les paramètres utilisateur
  async getUserSettings(req, res) {
    try {
      const userId = req.user.userId

      let settings = await UserSettings.findOne({
        where: { userId },
      })

      if (!settings) {
        // Créer les paramètres par défaut
        settings = await UserSettings.create({
          userId,
        })
      }

      res.json({
        notifications: settings.notifications,
        security: settings.security,
        privacy: settings.privacy,
        preferences: settings.preferences,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Mettre à jour les paramètres utilisateur
  async updateUserSettings(req, res) {
    try {
      const userId = req.user.userId
      const { notifications, security, privacy, preferences } = req.body

      let settings = await UserSettings.findOne({
        where: { userId },
      })

      if (!settings) {
        settings = await UserSettings.create({
          userId,
        })
      }

      const updateData = {}
      if (notifications) updateData.notifications = notifications
      if (security) updateData.security = security
      if (privacy) updateData.privacy = privacy
      if (preferences) updateData.preferences = preferences

      await settings.update(updateData)

      res.json({
        message: "Paramètres mis à jour avec succès",
        settings: {
          notifications: settings.notifications,
          security: settings.security,
          privacy: settings.privacy,
          preferences: settings.preferences,
        },
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Exporter les données utilisateur (conformité RGPD)
  async exportUserData(req, res) {
    try {
      const userId = req.user.userId

      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Wallet,
            as: "wallets",
          },
          {
            model: Transaction,
            as: "transactions",
            limit: 1000, // Limite pour les performances
            order: [["createdAt", "DESC"]],
          },
          {
            model: UserSettings,
            as: "settings",
          },
        ],
      })

      if (!user) {
        return res.status(404).json({
          message: "Utilisateur introuvable",
        })
      }

      const exportData = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          kycStatus: user.kycStatus,
          accountStatus: user.accountStatus,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
        wallets: user.wallets,
        transactions: user.transactions,
        settings: user.settings,
        exportedAt: new Date(),
      }

      res.json({
        message: "Export des données initié",
        notice: "Vous recevrez un email avec les instructions de téléchargement dans les 24 heures",
        dataPreview: exportData,
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // Supprimer le compte utilisateur
  async deleteUserAccount(req, res) {
    try {
      const userId = req.user.userId

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          message: "Utilisateur introuvable",
        })
      }

      // Vérifier s'il y a des transactions en attente ou des soldes non nuls
      const pendingTransactions = await Transaction.count({
        where: {
          userId,
          status: ["pending", "processing"],
        },
      })

      if (pendingTransactions > 0) {
        return res.status(400).json({
          message: "Vous avez des transactions en attente. Veuillez attendre qu'elles soient terminées.",
        })
      }

      const walletsWithBalance = await Wallet.count({
        where: {
          userId,
          balance: { [sequelize.Op.gt]: 0 },
        },
      })

      if (walletsWithBalance > 0) {
        return res.status(400).json({
          message: "Veuillez retirer tous les fonds de vos portefeuilles avant de supprimer votre compte.",
        })
      }

      const dbTransaction = await sequelize.transaction()

      try {
        // Supprimer ou anonymiser les données utilisateur
        await user.update(
          {
            accountStatus: "closed",
            email: `deleted_${user.id}@africhange.com`,
            phone: `deleted_${user.id}`,
            name: "Utilisateur Supprimé",
            avatar: null,
          },
          { transaction: dbTransaction },
        )

        // Supprimer les paramètres utilisateur
        await UserSettings.destroy({
          where: { userId },
          transaction: dbTransaction,
        })

        await dbTransaction.commit()

        res.json({
          message: "Compte supprimé avec succès",
        })
      } catch (error) {
        await dbTransaction.rollback()
        throw error
      }
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

module.exports = new ProfileController()
