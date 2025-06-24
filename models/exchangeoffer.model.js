module.exports = (sequelize, DataTypes) => {
  const ExchangeOffer = sequelize.define('ExchangeOffer', {
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
      type: DataTypes.ENUM('open', 'matched', 'cancelled'),
      defaultValue: 'open',
    },
    matchedWith: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  ExchangeOffer.associate = (models) => {
    ExchangeOffer.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ExchangeOffer;
};
