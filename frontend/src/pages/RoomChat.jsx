import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { roomSelector, getRoomUsers } from "../features/room/roomSlice";
import {
  createMessage,
  messageSelector,
  getMessages,
} from "../features/message/messageSlice";
import { authSelector } from "../features/auth/authSlice";
import io from "socket.io-client";
import { toast } from "react-toastify";
import MessageBox from "../components/MessageBox";
export const socket = io("/");
import { format } from "date-fns";
import styled from "styled-components";
import { DotLoader } from "react-spinners";

const LoadingDiv = styled.h1`
  height: 90vh;
  width: 100%;
  display: grid;
  place-content: center;
`;

const RoomChatPage = styled.div`
  margin: 60px auto;
  height: 80vh;
  widht: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;

  h1,
  h3 {
    text-align: center;
    margin-bottom: 10px;
  }
  .room-details {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 20px;
  }

  .room-chat {
    height: 65vh;
    width: 75%;
    border-radius: 5px;
    overflow-y: scroll;
    padding: 15px 15px 0px 15px;
    background-color: #f7f6dc;
    box-shadow: -2px -2px 5px 1px rgba(0, 0, 0, 0.2),
      2px 2px 5px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    scroll-behaviour: auto;
    &::-webkit-scrollbar {
      width: 5px;
      background: #fff;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #aaa;
      border-radius: 5px;
      height: 10px;
    }
  }

  .room-users {
    padding: 15px 15px 0px 15px;
    height: 114%;
    width: 20%;
    border-radius: 5px;
    box-shadow: -2px -2px 5px 1px rgba(0, 0, 0, 0.2),
      2px 2px 5px 1px rgba(0, 0, 0, 0.2);
    background-color: white;
    color: black;
  }
  .room-bottom {
    display: flex;
    gap: 20px;
    justify-content: flex-start;
    width: 100%;
  }
  .room-form {
    height: 40px;
    width: 75%;
    display: flex;
    input {
      height: 100%;
      width: 90%;
      padding: 5px 15px;
      border: 2px solid purple;
      border-radius: 5px 0px 0px 5px;
      outline: none;
    }
    button {
      height: 100%;
      width: 10%;
      cursor: pointer;
      border: none;
      outline: none;
      background-color: purple;
      color: white;
      border-radius: 0px 5px 5px 0px;
    }
  }
  .room-info {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    p {
      font-size: 15px;
      font-width: 600;
      margin-right: 15px;
    }
  }
  @media (max-width: 500px) {
    .room-users {
      display: none;
    }
    .room-chat {
      width: 100%;
    }
    .room-form {
      width: 100%;
      input {
        width: 75%;
      }
      button {
        width: 25%;
      }
    }
  }
`;
const RoomChat = () => {
  const { room, roomUsers, isError, message, isLoading } =
    useSelector(roomSelector);
  const { user } = useSelector(authSelector);
  const { messages } = useSelector(messageSelector);
  const [newMessage, setNewMessage] = useState("");
  let params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const msgBoxRef = useRef(null);
  const currentRoomId = params.id;
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (!room) {
      navigate("/");
    } else {
      socket.emit("user-joined", currentRoomId);
      dispatch(getRoomUsers(currentRoomId));
      dispatch(getMessages(currentRoomId));
    }
    socket.on("get-users", () => {
      dispatch(getRoomUsers(currentRoomId));
    });

    socket.on("msg", () => {
      dispatch(getMessages(currentRoomId));
    });
  }, [socket, navigate, dispatch, isError, message]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim().length === 0) {
      toast.error("Type a valid message");
    } else {
      dispatch(
        createMessage({
          room: currentRoomId,
          message: newMessage,
          sender: user.name,
        })
      );
      socket.emit("getMessages", currentRoomId);
      setNewMessage("");
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight + 100;
    }
  };
  if (isLoading) {
    return (
      <LoadingDiv>
        <DotLoader />
      </LoadingDiv>
    );
  }
  return (
    <RoomChatPage>
      <div className="room-info">
        <p>RoomID: {room && room.roomId}</p>
        <p>Time: {format(new Date(), "hh:mm")}</p>
      </div>
      <div className="room-details">
        <div className="room-chat" ref={msgBoxRef}>
          <h3 style={{ color: "#170055" }}>Hello {user && user.name}</h3>
          {messages &&
            messages?.map((msg) => <MessageBox key={msg._id} message={msg} />)}
        </div>
        <div className="room-users">
          <h3>Room users</h3>
          {room &&
            roomUsers.map((roomUser) => (
              <div
                style={{
                  height: "30px",
                  width: "80%",
                  padding: "5px 10px",
                  backgroundColor: "purple",
                  color: "white",
                  borderRadius: "10px",
                  margin: "5px 10px",
                }}
              >
                <p key={roomUser.userid} style={{ textAlign: "center" }}>
                  {roomUser.username}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className="room-bottom">
        <form className="form room-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            placeholder="Enter your message"
            onChange={(e) => setNewMessage(e.target.value)}
            name="message"
            id="message"
            required
          />

          <button type="submit">Send </button>
        </form>
      </div>
    </RoomChatPage>
  );
};
export default RoomChat;
