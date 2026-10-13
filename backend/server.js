require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Member, Trainer, WorkoutPackage, Booking } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/members', asyncRoute(async (req, res) => res.json(await Member.findAll({ order: [['name', 'ASC']] }))));
app.post('/api/members', asyncRoute(async (req, res) => res.status(201).json(await Member.create(req.body))));

app.get('/api/trainers', asyncRoute(async (req, res) => res.json(await Trainer.findAll({ include: [WorkoutPackage], order: [['name', 'ASC']] }))));
app.post('/api/trainers', asyncRoute(async (req, res) => res.status(201).json(await Trainer.create(req.body))));

app.get('/api/packages', asyncRoute(async (req, res) => res.json(await WorkoutPackage.findAll({ include: [{ model: Trainer, attributes: ['id', 'name', 'specialty'] }], order: [['createdAt', 'DESC']] }))));
app.post('/api/packages', asyncRoute(async (req, res) => res.status(201).json(await WorkoutPackage.create(req.body))));

app.get('/api/bookings', asyncRoute(async (req, res) => res.json(await Booking.findAll({
  include: [{ model: Member, attributes: ['id', 'name', 'email'] }, { model: Trainer, attributes: ['id', 'name', 'specialty'] }],
  order: [['slotDate', 'ASC'], ['slotTime', 'ASC']]
}))));
app.post('/api/bookings', asyncRoute(async (req, res) => {
  const { memberId, trainerId, slotDate, slotTime, notes } = req.body;
  if (!memberId || !trainerId || !slotDate || !slotTime) return res.status(400).json({ message: 'Member, trainer, date and time are required.' });
  const exists = await Booking.findOne({ where: { trainerId, slotDate, slotTime, status: 'Booked' } });
  if (exists) return res.status(409).json({ message: 'This trainer slot is already booked.' });
  res.status(201).json(await Booking.create({ memberId, trainerId, slotDate, slotTime, notes }));
}));
app.patch('/api/bookings/:id/cancel', asyncRoute(async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  await booking.update({ status: 'Cancelled' });
  res.json(booking);
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError' ? 400 : 500)
    .json({ message: err.errors?.[0]?.message || err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => app.listen(PORT, () => console.log(`Gym Scheduler API running on http://localhost:${PORT}`)))
  .catch(err => { console.error('MySQL connection failed:', err.message); process.exit(1); });
