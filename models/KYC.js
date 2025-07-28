module.exports = (sequelize, DataTypes) => {
  const KYC = sequelize.define("KYC", {
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
    documentType: {
      type: DataTypes.ENUM("passport", "national_id", "driver_license"),
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    documentFrontUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    documentBackUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    selfieUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "under_review", "approved", "rejected"),
      defaultValue: "pending",
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  KYC.associate = (models) => {
    KYC.belongsTo(models.User, { foreignKey: "userId" });
  };

  return KYC;
}
