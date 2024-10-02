const error404 = (req, res, next) => {
    const error = new Error(`Le lien ${req.url} est introuvable.`);
    res.status(404);
    next(error);
  };
  
  const error500 = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
    });
  };
  
  module.exports = { error404, error500 };
  