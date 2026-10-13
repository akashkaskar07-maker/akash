module.exports = (sequelize, DataTypes) => sequelize.define('Booking', {
  slotDate: { type: DataTypes.DATEONLY, allowNull: false },
  slotTime: { type: DataTypes.STRING(5), allowNull: false },
  status: { type: DataTypes.ENUM('Booked', 'Completed', 'Cancelled'), defaultValue: 'Booked' },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'bookings',
  timestamps: true,
  indexes: [{ unique: true, fields: ['trainerId', 'slotDate', 'slotTime'], name: 'unique_trainer_slot' }]
});
