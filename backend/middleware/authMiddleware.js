const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(400);
      throw new Error("Not authorized");
    }
    next();
  } else {
    res.status(400);
    throw new Error("No authorization. no token");
  }
});

module.exports = authMiddleware;
