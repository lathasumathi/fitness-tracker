const express = require('express');
const authRoutes = require('./authRoutes');
const workoutRoutes = require('./workoutRoutes');
const aiRoutes = require('./aiRoutes');
const documentRoutes = require('./documentRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/workouts', workoutRoutes);
router.use('/ai', aiRoutes);
router.use('/documents', documentRoutes);
router.use('/admin', adminRoutes);
module.exports = router;