module.exports = (sequelize, DataTypes) => sequelize.define('Trainer', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  specialty: { type: DataTypes.STRING(100), allowNull: false },
  experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'trainers', timestamps: true });
