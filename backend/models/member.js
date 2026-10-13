module.exports = (sequelize, DataTypes) => sequelize.define('Member', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  membershipType: { type: DataTypes.ENUM('Basic', 'Standard', 'Premium'), defaultValue: 'Basic' }
}, { tableName: 'members', timestamps: true });
