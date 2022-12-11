import { useSelector, useDispatch } from "react-redux";
import { authSelector } from "../features/auth/authSlice";
import {
  roomSelector,
  reset,
  createRoom,
  joinRoom,
} from "../features/room/roomSlice";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DotLoader } from "react-spinners";
import { nanoid } from "nanoid";

import MeetImage from "/meet.png";
import DevGif from "/dev.gif";

const LoadingDiv = styled.h1`
  height: 90vh;
  width: 100%;
  display: grid;
  place-content: center;
`;
const DashboardPage = styled.div`
  margin: 0px auto;
  margin-top: 50px;
  height: 60vh;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  h1 {
    font-size: 50px;
  }
  .dashboard {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    gap: 40px;
    border-radius: 5px;
    padding: 40px 20px;
    .forms {
      height: 100%;
      width: 70%;
      display: flex;
      flex-direction: column;
      gap: 30px;
      .title {
        display: flex;
        img {
          height: 100px;
          width: 100px;
          margin-left: 20px;
        }
      }
      .create-join-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        border: 0px 2px 2px 2px solid purple;
        gap: 5px;
        .or {
          font-size: 15px;
        }
        form {
          display: flex;
          width: 100%;
          height: 100%;
          gap: 5px;
          
            input {
              height: 40px;
              width: 100%;
              padding: 5px 10px;
              border-radius: 5px;
              outline: none;
              border: 2px solid transparent;
            }
            button {
              height: 40px;
              width: 35%;
              cursor: pointer;
              outline: none;
              border: 2px solid #2b4865;
              background-color: #c3ff99;
              border-radius: 5px;
              &.submit {
                width: 100%;
              }
              &:hover {
                background-color: #59ce8f;
                border-color: #fff;
                color: white;
              }
            }
          
        }
      }
    }
    .img {
      height: 70vh;
      width: 500px;
      position: relative;
      top: -30px;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  @media (max-width: 900px) {
    margin-top: 100px;
    h1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justicy-content: center;
      font-size: 40px;
    }
    .title {
      h1 {
        font-size: 25px;
      }
      img {
        display: none;
      }
    }
    .dashboard{
      flex-direction: column;
      .forms{
        padding: 10px;
        width: 100%;
        align-items: center;
        justify-content-center;
      }
    }
    .img{
      display: none;
    }
    .form{
      width: 100%;
      .form-group input{
        width: 80%;
      }
      .form-group button{
        width: max-content;
        align-self: flex-end;
      }
    }
  }
  
`;
const Dashboard = () => {
  // hooks
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { room, isError, isLoading, isSuccess, message } =
    useSelector(roomSelector);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && room) {
      navigate(`/room/${room.roomId}`);
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createRoom({ roomid: nanoid(10) }));
  };
  const handleJoin = (e) => {
    e.preventDefault();
    dispatch(joinRoom(roomCode));
  };

  if (isLoading) {
    return (
      <LoadingDiv>
        <DotLoader />
      </LoadingDiv>
    );
  }
  return (
    <DashboardPage>
      <h1>
        Welcome <span>{user && user.name}</span>
      </h1>
      <div className="dashboard">
        <div className="forms">
          {/* join form  */}
          <div className="title">
            <h1>Chat for free</h1>
            <img src={MeetImage} alt="Meet image" />
          </div>
          <p>
            You can create a room and share it with your friends or you can join
            the room which your friends created. Have fun...
          </p>
          <div className="create-join-form">
            <form className="join-form form" onSubmit={handleJoin}>
              <input
                type="text"
                placeholder="Type a room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
              />
              <button type="submit">Join Room</button>
            </form>
            <span className="or">OR</span>
            {/* create form */}
            <form className="create-form form" onSubmit={handleCreate}>
              <button type="submit" className="submit">
                Create Room
              </button>
            </form>
          </div>
        </div>
        <div className="img">
          <img src={DevGif} alt="" />
        </div>
      </div>
    </DashboardPage>
  );
};
export default Dashboard;
