const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Administrator access is required' });
  }
  return next();
};

module.exports = { admin };