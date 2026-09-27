const multer = require('multer');

const allowedTypes = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.UPLOAD_MAX_BYTES || 2 * 1024 * 1024) },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(new Error('Only plain text, Markdown, CSV, and JSON files are supported'));
    }
    return cb(null, true);
  },
});

module.exports = upload;