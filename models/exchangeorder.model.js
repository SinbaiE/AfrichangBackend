module.exports = (sequelize, DataTypes) => {
  const ExchangeOrder = sequelize.define('ExchangeOrder', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'completed', 'cancelled'),
      defaultValue: 'open',
    },
    matchedWith: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  ExchangeOrder.associate = (models) => {
    ExchangeOrder.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ExchangeOrder;
};
