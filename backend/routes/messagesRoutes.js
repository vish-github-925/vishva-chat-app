const {
  getMessages,
  createMessage,
  deleteMessage,
} = require("../controllers/messagesControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/:id", authMiddleware, getMessages);
router.post("/", authMiddleware, createMessage);
router.delete("/:id", authMiddleware, deleteMessage);

module.exports = router;
