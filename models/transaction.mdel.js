module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdraw', 'transfer'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Transaction;
};
