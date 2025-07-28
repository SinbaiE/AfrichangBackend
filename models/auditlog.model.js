module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define("AuditLog", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oldValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    newValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  AuditLog.associate = (models) => {
     AuditLog.belongsTo(models.User, { foreignKey: 'userId' });
   };

  return AuditLog
}



// module.exports = (sequelize, DataTypes) => {
//   const AuditLog = sequelize.define('AuditLog', {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     action: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     target: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     targetId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     metadata: {
//       type: DataTypes.JSON,
//       allowNull: true,
//     },
//   });

//   AuditLog.associate = (models) => {
//     AuditLog.belongsTo(models.User, { foreignKey: 'userId' });
//   };

//   return AuditLog;
// };
