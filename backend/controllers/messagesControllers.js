const asyncHandler = require("express-async-handler");
const Message = require("../models/messagesModel");
// @desc get messages
// @route GET /api/messages
// @access PRIVATE
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ room: req.params.id });
  if (!messages) {
    res.status(500);
    throw new Error("Couldn't get messages");
  }
  res.status(200).json(messages);
});

// @desc create a message
// @route POST /api/messages
// @access PRIVATE
const createMessage = asyncHandler(async (req, res) => {
  const { message, room, sender } = req.body;
  const senderId = req.user._id;
  const newMessage = await Message.create({
    message,
    room,
    sender,
    senderId
  });
  if (!newMessage) {
    res.status(400);
    throw new Error("Couldn't create new message");
  }

  res.status(200).json(newMessage);
});

// @desc delete a message
// @route DELETE /api/messages/id
// @access PRIVATE
const deleteMessage = asyncHandler(async (req, res) => {
  const newMessage = await Message.findById(req.params.id);
  if (!newMessage) {
    res.status(404);
    throw new "Message not found"();
  }
  await newMessage.remove();
  res.status(200).json({
    id: req.params.id,
  });
});
module.exports = {
  getMessages,
  createMessage,
  deleteMessage,
};
