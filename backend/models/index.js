const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gym_scheduler',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);

const Member = require('./member')(sequelize, DataTypes);
const Trainer = require('./trainer')(sequelize, DataTypes);
const WorkoutPackage = require('./workoutPackage')(sequelize, DataTypes);
const Booking = require('./booking')(sequelize, DataTypes);

Trainer.hasMany(WorkoutPackage, { foreignKey: 'trainerId', onDelete: 'CASCADE' });
WorkoutPackage.belongsTo(Trainer, { foreignKey: 'trainerId' });

Member.belongsToMany(Trainer, { through: Booking, foreignKey: 'memberId', otherKey: 'trainerId', as: 'trainers' });
Trainer.belongsToMany(Member, { through: Booking, foreignKey: 'trainerId', otherKey: 'memberId', as: 'members' });
Member.hasMany(Booking, { foreignKey: 'memberId' });
Booking.belongsTo(Member, { foreignKey: 'memberId' });
Trainer.hasMany(Booking, { foreignKey: 'trainerId' });
Booking.belongsTo(Trainer, { foreignKey: 'trainerId' });

module.exports = { sequelize, Member, Trainer, WorkoutPackage, Booking };
