module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define("Deposit", {
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
    allowNull: false, // selon ton besoin
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
    // fees: {
    //   type: DataTypes.DECIMAL(10, 2),
    //   defaultValue: 0.0,
    // },
    // netAmount: {
    //   type: DataTypes.DECIMAL(15, 2),
    //   allowNull: false,
    // },
    paymentDetails: {
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

  Deposit.associate = (models) => {
    Deposit.belongsTo(models.PaymentMethod, { foreignKey: 'paymentMethodId' });
    Deposit.belongsTo(models.User, { foreignKey: 'userId' });
    Deposit.belongsTo(models.Wallet, { foreignKey: 'walletId' });
  };

  return Deposit;
};


// module.exports = (sequelize, DataTypes) => {
//   const Deposit = sequelize.define('Deposit', {
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

//   Deposit.associate = (models) => {
//     Deposit.belongsTo(models.User, { foreignKey: 'userId' });
//   };

//   return Deposit;
// };
