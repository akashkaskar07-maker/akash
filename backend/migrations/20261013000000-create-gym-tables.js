'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(30) },
      membershipType: { type: Sequelize.ENUM('Basic', 'Standard', 'Premium'), defaultValue: 'Basic' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.createTable('trainers', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      specialty: { type: Sequelize.STRING(100), allowNull: false },
      experienceYears: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.createTable('workout_packages', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING(120), allowNull: false },
      description: { type: Sequelize.TEXT },
      durationWeeks: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 4 },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      trainerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'trainers', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.createTable('bookings', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      slotDate: { type: Sequelize.DATEONLY, allowNull: false },
      slotTime: { type: Sequelize.STRING(5), allowNull: false },
      status: { type: Sequelize.ENUM('Booked', 'Completed', 'Cancelled'), defaultValue: 'Booked' },
      notes: { type: Sequelize.TEXT },
      memberId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'members', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      trainerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'trainers', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    await queryInterface.addIndex('bookings', ['trainerId', 'slotDate', 'slotTime'], { unique: true, name: 'unique_trainer_slot' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('workout_packages');
    await queryInterface.dropTable('trainers');
    await queryInterface.dropTable('members');
  }
};
