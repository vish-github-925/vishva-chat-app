const mongoose = require("mongoose");
const User = require("./usersModel");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      default: "Welcome to the chat",
    },
    sender: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
