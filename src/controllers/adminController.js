const User = require('../models/User');
const Document = require('../models/Document');
const ActivityLog = require('../models/ActivityLog');
const Chat = require('../models/Chat');
const { activitySummary } = require('../services/activityService');

const listUsers = async (req, res, next) => { try { const users = await User.find().select('-password').sort({ createdAt: -1 }); res.status(200).json({ success: true, count: users.length, data: users }); } catch (error) { next(error); } };
const updateUserRole = async (req, res, next) => { try { const { role } = req.body; if (!['user', 'admin'].includes(role)) return res.status(400).json({ success: false, error: 'Role must be user or admin' }); if (req.params.id === req.user._id.toString() && role !== 'admin') return res.status(400).json({ success: false, error: 'You cannot remove your own admin access' }); const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password'); if (!user) return res.status(404).json({ success: false, error: 'User not found' }); res.status(200).json({ success: true, data: user }); } catch (error) { next(error); } };
const listAllDocuments = async (req, res, next) => { try { const documents = await Document.find().select('-content').sort({ createdAt: -1 }); res.status(200).json({ success: true, count: documents.length, data: documents }); } catch (error) { next(error); } };
const listActivity = async (req, res, next) => { try { const logs = await ActivityLog.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(Math.min(Number(req.query.limit) || 100, 500)); res.status(200).json({ success: true, count: logs.length, data: logs }); } catch (error) { next(error); } };
const getSummary = async (req, res, next) => { try { const [users, documents, chats, activity] = await Promise.all([User.countDocuments(), Document.countDocuments(), Chat.countDocuments(), activitySummary()]); res.status(200).json({ success: true, data: { users, documents, chats, activity } }); } catch (error) { next(error); } };

module.exports = { listUsers, updateUserRole, listAllDocuments, listActivity, getSummary };