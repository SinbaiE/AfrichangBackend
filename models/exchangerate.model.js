module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define("ExchangeRate", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fromCurrency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    toCurrency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: "manual",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    validFrom: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  })


  return ExchangeRate
}
