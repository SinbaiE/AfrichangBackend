module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  });

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };

  return Wallet;
};
