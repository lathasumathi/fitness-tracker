const jwt = require('jsonwebtoken');
const User = require('../models/User');

const roleForEmail = (email) => {
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  return adminEmail && adminEmail === String(email).toLowerCase() ? 'admin' : 'user';
};

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, error: 'Please provide name, email and password' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, error: 'Email already registered' });
    const user = await User.create({ name, email, password, role: roleForEmail(email) });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    res.status(200).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
};

const getUserProfile = async (req, res, next) => {
  try { res.status(200).json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } }); } catch (error) { next(error); }
};

const logoutUser = async (req, res) => res.status(200).json({ success: true, message: 'Logout successful. Discard the client-side JWT.' });

module.exports = { registerUser, loginUser, getUserProfile, logoutUser };