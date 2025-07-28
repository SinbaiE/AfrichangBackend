module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    FirstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    LastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    kycStatus: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending",
    },
    accountStatus: {
      type: DataTypes.ENUM("active", "suspended", "closed"),
      defaultValue: "active",
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'users',
  });

  User.associate = (models) => {
    User.hasMany(models.Transaction, { foreignKey: 'userId' });
    User.hasMany(models.Wallet, { foreignKey: 'userId' });
    User.hasMany(models.Withdrawal, { foreignKey: 'userId' });
    User.hasMany(models.Deposit, { foreignKey: 'userId' });
    User.hasMany(models.ExchangeOrder, { foreignKey: 'userId' });
    User.hasMany(models.ExchangeOffer, { foreignKey: 'userId' });
    User.hasMany(models.AuditLog, { foreignKey: 'userId' });
    User.hasOne(models.KYC, { foreignKey: 'userId' });
    User.hasOne(models.UserSettings, { foreignKey: 'userId' });
    User.hasOne(models.PaymentMethod, { foreignKey: 'userId' });
  };

  return User;
};
