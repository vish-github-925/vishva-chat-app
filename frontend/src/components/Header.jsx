import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserAlt } from "react-icons/fa";
import { MdOutlineMeetingRoom } from "react-icons/md";
import styled from "styled-components";
import { authSelector, logout } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  roomSelector,
  leaveRoom,
  reset,
  getRoomUsers,
} from "../features/room/roomSlice";
import { socket } from "../pages/RoomChat";

// styles
const Nav = styled.div`
  h1 {
    color: white;
  }
  height: 50px;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  font-weight: 500;
  display: flex;
  padding: 5px 50px;
  align-items: center;
  .logo {
    width: 75%;
  }
  .nav-list {
    display: flex;
    width: 25%;
    margin-right: 40px;
  }
  li {
    margin: 0 1rem;
    padding: 10px 0px 5px 0px;
    button {
      cursor: pointer;
      color: white;
      padding: 10px;
      border-radius: 5px;
      outline: none;
      border: none;
      background-color: #2e0249;
      &:hover {
        background-color: purple;
      }
    }
    a {
      color: white;
      h1 {
        color: white;
      }
      &:hover {
        border-bottom: 3px solid purple;
      }
    }
  }
  .logout,
  .leave-room {
    display: flex;
    width: max-content;
  }
  @media (max-width: 500px) {
    h1 {
      font-size: 30px;
    }
    li {
      flex-direction: column;
      button {
        background-color: transparent;
        transform: translateY(3px);
      }
      a {
        display: flex;
        font-size: 15px;
      }
    }
    .login,
    .register {
      display: none;
    }
    .leave-room{
      transform: translateX(-30px);
    }
  }
`;

const Header = () => {
  // hooks
  const { user } = useSelector(authSelector);
  const { room } = useSelector(roomSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLeaveRoom = () => {
    dispatch(leaveRoom({ roomCode: room.roomId }));
    socket.emit("user-left", room.roomId);
    dispatch(reset());
    navigate("/");
  };
  const onLogout = () => {
    if (room) {
      dispatch(leaveRoom({ roomCode: room.roomId }));
    }
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Nav>
      <div className="logo">
        <Link to="/">
          <h1>UV Chat</h1>
        </Link>
      </div>
      <ul className="nav-list">
        {user ? (
          <li className="nav-list-item logout">
            <button onClick={onLogout}>
              <FaUserAlt /> Logout
            </button>
          </li>
        ) : (
          <>
            <li className="nav-list-item login">
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li className="nav-list-item register">
              <Link to="/register">
                <FaUserAlt /> Register
              </Link>
            </li>
          </>
        )}
        {room && (
          <li className="nav-list-item leave-room">
            <button onClick={onLeaveRoom}>
              <MdOutlineMeetingRoom /> Leave Room
            </button>
          </li>
        )}
      </ul>
    </Nav>
  );
};
export default Header;
