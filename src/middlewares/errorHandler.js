const errorHandler = (err, res) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  console.error('Stack:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};