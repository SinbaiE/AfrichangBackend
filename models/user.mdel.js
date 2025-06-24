module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
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
  };

  return User;
};
