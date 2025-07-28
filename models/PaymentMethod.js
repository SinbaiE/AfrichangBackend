module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define("PaymentMethod", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("mobile_money", "bank_transfer", "card", "crypto", "cash_pickup"),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fees: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
      comment: "Fee percentage",
    },
    minAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 1.0,
    },
    maxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 1000000.0,
    },
    processingTime: {
      type: DataTypes.STRING(100),
      defaultValue: "Instantané",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    supportedCurrencies: {
      type: DataTypes.JSON,
      defaultValue: ["XOF", "NGN", "GHS", "KES"],
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Provider-specific configuration",
    },
  });

  PaymentMethod.associate = (models) => {
    PaymentMethod.belongsTo(models.User, { foreignKey: "userId" });
    PaymentMethod.hasMany(models.Deposit, { foreignKey: 'paymentMethodId' })
  };

  return PaymentMethod;
}
