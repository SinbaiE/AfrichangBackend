module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define("UserSettings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    notifications: {
      type: DataTypes.JSON,
      defaultValue: {
        transactions: true,
        marketing: false,
        security: true,
        rateAlerts: true,
      },
    },
    security: {
      type: DataTypes.JSON,
      defaultValue: {
        biometric: false,
        twoFactor: false,
        loginAlerts: true,
      },
    },
    privacy: {
      type: DataTypes.JSON,
      defaultValue: {
        profileVisible: true,
        transactionHistory: false,
        onlineStatus: true,
      },
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        language: "fr",
        currency: "XOF",
        theme: "light",
      },
    },
  });

  UserSettings.associate = (models) => {
    UserSettings.belongsTo(models.User, { foreignKey: "userId" });
  }; 

  return UserSettings
}
