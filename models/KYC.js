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

    // --- Personal Info ---
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
    nationality: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING,unique: true, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: true },
    postalCode: { type: DataTypes.STRING, allowNull: true },
    occupation: { type: DataTypes.STRING, allowNull: true },
    monthlyIncome: { type: DataTypes.STRING, allowNull: true },

    // --- Document Info ---
    documentType: {
      type: DataTypes.ENUM("passport", "national_id", "driver_license"),
      allowNull: false,
    },
    documentNumber: { type: DataTypes.STRING,unique: true, allowNull: false },
    expiryDate: { type: DataTypes.DATEONLY, allowNull: true },
    issuingCountry: { type: DataTypes.STRING, allowNull: true },

    // --- Selfie Verification ---
    livenessCheck: { type: DataTypes.BOOLEAN, defaultValue: false },
    faceMatch: { type: DataTypes.BOOLEAN, defaultValue: false },

    // --- Status & Rejection ---
    status: {
      type: DataTypes.ENUM( "pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    rejectionReason: { type: DataTypes.STRING, allowNull: true },
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },

    // info de selfie 
    documentFrontUrl: { type: DataTypes.STRING(500), allowNull: false },
    documentBackUrl: { type: DataTypes.STRING(500), allowNull: true },
    selfieUrl: { type: DataTypes.STRING(500), allowNull: false },

  }, {
    tableName: "kyc",
    timestamps: true,
  });

  KYC.associate = (models) => {
    KYC.belongsTo(models.User, { foreignKey: "userId" });
  };

  return KYC;
};
