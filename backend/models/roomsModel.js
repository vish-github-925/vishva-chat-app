const mongoose = require("mongoose");
const User = require("./usersModel");

const roomSchema = new mongoose.Schema(
  {
    roomid: {
      type: String,
      required: true,
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },

    users: [
      {
        username: {
          type: String,
          required: true,
        },
        userid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
