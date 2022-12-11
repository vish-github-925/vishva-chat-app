import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { authSelector } from "../features/auth/authSlice";
import { roomSelector } from "../features/room/roomSlice";
import { deleteMessage } from "../features/message/messageSlice";
import { FaTrashAlt } from "react-icons/fa";
import { socket } from "../pages/RoomChat";
import { format } from "date-fns";
const MessageBoxDiv = styled.div`
  height: max-content;
  width: 100%;
  color: black;
  padding: 5px 15px;
  border-radius: 5px;
  background-color: lightblue;
  display: flex;
  gap: 3px;
  margin-bottom: 10px;
  .msg {
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    height: max-content;
    width: 100%;
    gap: 3px;
    span {
      font-size: 10px;
      align-self: flex-end;
    }
  }
`;
const MessageBox = ({ message }) => {
  const { user } = useSelector(authSelector);
  const { room } = useSelector(roomSelector);
  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(deleteMessage(message._id));
    socket.emit("getMessages", room.roomId);
  };
  return (
    <MessageBoxDiv
      style={
        user.name === message.sender
          ? { backgroundColor: "rgb(211, 211, 211)", alignSelf: "flex-end" }
          : {
              backgroundColor: "#63a355",
              color: "white",
              alignSelf: "flex-start",
            }
      }
    >
      <div className="msg">
        <p style={{ fontSize: "10px" }}>
          {message.sender === user.name ? "You" : message.sender || "nouser"}
        </p>
        <p style={{ fontSize: "15px" }}>{message.message}</p>
        <span>{format(new Date(message.createdAt), "hh:mm")}</span>
      </div>
      <FaTrashAlt
        role="button"
        onClick={onDelete}
        style={{ alignSelf: "flex-end", cursor: "pointer" }}
      >
        delete
      </FaTrashAlt>
    </MessageBoxDiv>
  );
};
export default MessageBox;
