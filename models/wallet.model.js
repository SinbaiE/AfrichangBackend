module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    "Wallet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        validate: {
          isIn: [["XOF", "XAF", "NGN", "GHS", "KES", "UGX", "TZS", "ZAR"]],
        },
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: 0,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      lastTransactionAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["userId", "currency"],
          name: "unique_user_currency",
        },
      ],
    },
  );

  Wallet.associate = (models) => {
  // Un portefeuille appartient à un utilisateur
  Wallet.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  // Un portefeuille peut avoir plusieurs transactions
  Wallet.hasMany(models.Transaction, { foreignKey: 'walletId' });
  // Un portefeuille peut avoir plusieurs dépôts
  Wallet.hasMany(models.Deposit, { foreignKey: 'walletId' });
  // Un dépôt appartient à un portefeuille (ceci doit être dans le modèle Deposit.js)
  // Deposit.belongsTo(models.Wallet, { foreignKey: 'walletId' });
  // Un portefeuille peut avoir plusieurs retraits
  Wallet.hasMany(models.Withdrawal, { foreignKey: 'walletId' });
};


  return Wallet
}



// module.exports = (sequelize, DataTypes) => {
//   const Wallet = sequelize.define('Wallet', {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     currency: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     balance: {
//       type: DataTypes.DECIMAL(20, 2),
//       allowNull: false,
//       defaultValue: 0.00,
//     },
//   });

//   Wallet.associate = (models) => {
//     Wallet.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
//   };

//   return Wallet;
// };
