const asyncHandler = require("express-async-handler");
const User = require("../models/usersModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc register a user
// @route POST /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ((!name, !email, !password)) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400);
    throw new Error("Unable to create the user at this time");
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    token: generateToken(user._id),
  });
});

// @desc Login a user
// @route POST /api/users
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  //check user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User doesn't exist");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user._id,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc Get a user
// @route GET /api/users
// @access PRIVATE
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  });
});

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
};
