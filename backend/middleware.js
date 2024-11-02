const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({
        message: "Header not found"
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({
      message: "token verification failed",
    });
  }
};

module.exports = {
  authMiddleware,
};
