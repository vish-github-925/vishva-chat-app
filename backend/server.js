const express = require("express");
const http = require("http");
const colors = require("colors");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/dbConn");
const errorMiddleware = require("./middleware/errorMiddleware");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
// mongodb connect
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// socket io
const io = new Server(server, {
  cors: {},
});
io.on("connection", (socket) => {
  socket.on("user-joined", (room) => {
    socket.join(room);
    socket.to(room).emit("get-users");
  });

  socket.on("getMessages", (room) => {
    socket.to(room).emit("msg");
  });
  socket.on("disconnect", () => {});

  socket.on("user-left", (room) => {
    socket.to(room).emit("get-users");
  });
});
// routes
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/room", require("./routes/roomsRoutes"));
app.use("/api/messages", require("./routes/messagesRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "dist", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("Please set to production");
  });
}

app.use(errorMiddleware);

// error middleware

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`server is running on PORT: ${PORT}`));
