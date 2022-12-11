const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/usersControllers.js");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);

module.exports = router;
