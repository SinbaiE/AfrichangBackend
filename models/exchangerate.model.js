module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    fromCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return ExchangeRate;
};
