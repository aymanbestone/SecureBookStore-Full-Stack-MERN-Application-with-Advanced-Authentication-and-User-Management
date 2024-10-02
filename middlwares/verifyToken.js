const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.secret_key);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token" });
    }
  } else {
     return res.status(403).json({ message: "no token provided" });
  }
}


function verifyTokenAndautorize(req, res, next) {
  verifyToken(req, res, () => {
    if (req.params.id === req.user.id || req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({
          message: `your not allowed , only ${req.user.username} that can do this `,
        });
    }
  });
}
function verifyTokenAndadmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "your not allowed , only admin " });
    }
  });
}

module.exports = { verifyToken, verifyTokenAndautorize, verifyTokenAndadmin };
