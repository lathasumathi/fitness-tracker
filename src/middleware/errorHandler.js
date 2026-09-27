const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.error(err);

  if (err.name === 'CastError') {
    error.message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
  }
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered.';
    error.statusCode = 400;
  }
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map((value) => value.message).join(', ');
    error.statusCode = 400;
  }
  if (err.name === 'MulterError' || /file type|not supported|only plain text/i.test(err.message || '')) {
    error.message = err.message || 'Unsupported file upload';
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;