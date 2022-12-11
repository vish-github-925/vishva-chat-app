const asyncHandler = require("express-async-handler");
const Room = require("../models/roomsModel");
const User = require("../models/usersModel");

// @desc create a room
// @route POST /api/room
// @access PRIVATE

const createRoom = asyncHandler(async (req, res) => {
  const { roomid } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(400);
    throw new Error("User doesnt exists, Please login to create a room");
  }
  const room = await Room.create({
    roomid,
    organiser: user._id,
    users: [{ username: user.name, userid: user._id }],
  });

  if (!room) {
    res.status(400);
    throw new Error("Unable to create a room!");
  }
  res.status(200).json({
    roomId: room.roomid,
    organiser: room.organiser,
    users: room.users,
  });
});

// @desc get a room
// @route GET /api/messages
// @access PRIVATE
const joinRoom = asyncHandler(async (req, res) => {
  const roomCode = req.params.id;
  if (!roomCode) {
    res.status(400);
    throw new Error("Please enter room code to join the room");
  }
  const room = await Room.findOne({ roomid: roomCode });
  if (!room) {
    res.status(400);
    throw new Error("There is no room with this code");
  }

  if (
    room.users.every((roomUser) => roomUser.userid.toString() !== req.user.id)
  ) {
    room.users.push({ username: req.user.name, userid: req.user.id });
    await room.save();
  } else {
    console.log("user already joined");
  }

  res.status(200).json({
    roomId: room.roomid,
    organiser: room.organiser,
    users: room.users,
  });
});

// @desc Leave a room
// @route POST /api/messages
// @access PRIVATE
const leaveRoom = asyncHandler(async (req, res) => {
  const { roomCode } = req.body;
  if (!roomCode) {
    res.status(400);
    throw new Error("Please enter room code to join the room");
  }
  const room = await Room.findOne({ roomid: roomCode });
  if (!room) {
    res.status(400);
    throw new Error("There is no room with this code");
  }

  if (
    room.users.some((roomUser) => roomUser.userid.toString() === req.user.id)
  ) {
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: room.id },
      { $pull: { users: { userid: req.user.id } } },
      { safe: true, multi: false }
    );
    res.status(200).json({
      roomId: updatedRoom.roomid,
      organiser: updatedRoom.organiser,
      users: updatedRoom.users,
    });
  } else {
    res.status(400);
    throw new Error("User already left");
  }
});

const getRoomUsers = asyncHandler(async (req, res) => {
  const roomCode = req.params.id;
  if (!roomCode) {
    res.status(400);
    throw new Error("Please add a room code");
  }

  const room = await Room.findOne({ roomid: roomCode });
  if (!room) {
    res.status(400);
    throw new Error("Room doesnt exists");
  }

  res.status(200).json(room.users);
});
module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomUsers,
};
