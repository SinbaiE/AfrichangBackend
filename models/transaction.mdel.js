module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("deposit", "withdraw", "transfer", "exchange"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "failed", "cancelled"),
      defaultValue: "pending",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
    Transaction.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
    Transaction.belongsTo(models.Wallet, {foreignKey:'walletId'})
   };

  return Transaction
}


// module.exports = (sequelize, DataTypes) => {
//   const Transaction = sequelize.define('Transaction', {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     type: {
//       type: DataTypes.ENUM('deposit', 'withdraw', 'transfer'),
//       allowNull: false,
//     },
//     amount: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     currency: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'completed', 'failed'),
//       defaultValue: 'pending',
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     senderId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     receiverId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//   });

//   Transaction.associate = (models) => {
//     Transaction.belongsTo(models.User, { foreignKey: 'userId' });
//   };

//   return Transaction;
// };
