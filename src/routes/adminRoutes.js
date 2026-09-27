const express = require('express');
const { listUsers, updateUserRole, listAllDocuments, listActivity, getSummary } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();
router.use(protect, admin);
router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/documents', listAllDocuments);
router.get('/activity', listActivity);
router.get('/summary', getSummary);
module.exports = router;