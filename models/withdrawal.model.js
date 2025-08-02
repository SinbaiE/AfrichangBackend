module.exports = (sequelize, DataTypes) => {
  const Withdrawal = sequelize.define("Withdrawal", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    walletId: {
      type: DataTypes.INTEGER,
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
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "failed", "cancelled"),
      defaultValue: "pending",
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    externalReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    netAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    withdrawalDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Withdrawal.associate = (models) => {
    Withdrawal.belongsTo(models.User, { foreignKey: 'userId' });
    Withdrawal.belongsTo(models.wallet, { foreignKey: 'walletId' });
  };

  return Withdrawal;
}


// module.exports = (sequelize, DataTypes) => {
//   const Withdrawal = sequelize.define('Withdrawal', {
//     userId: {
//       type: DataTypes.INTEGER,
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
//     paymentMethod: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
//       defaultValue: 'pending',
//     },
//   });

//   Withdrawal.associate = (models) => {
//     Withdrawal.belongsTo(models.User, { foreignKey: 'userId' });
//   };

//   return Withdrawal;
// };
