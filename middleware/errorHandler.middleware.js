const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
  });
};

module.exports = errorHandler;
