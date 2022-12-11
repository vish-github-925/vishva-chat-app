const {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomUsers,
} = require("../controllers/roomsControllers.js");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", authMiddleware, createRoom);
router.get("/:id", authMiddleware, joinRoom);
router.post("/leave", authMiddleware, leaveRoom);
router.get("/users/:id", authMiddleware, getRoomUsers);

module.exports = router;
