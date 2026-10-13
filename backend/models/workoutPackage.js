module.exports = (sequelize, DataTypes) => sequelize.define('WorkoutPackage', {
  name: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  durationWeeks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'workout_packages', timestamps: true });
