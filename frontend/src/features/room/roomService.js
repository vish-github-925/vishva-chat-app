import axios from "axios";

const API_URL = "/api/room/";

// create
const create = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, roomData, config);
  if (response.data) {
    localStorage.setItem("vish-chat-app-rooms", JSON.stringify(response.data));
  }
  setTimeout(() => {}, 2000);
  return response.data;
};
// join
const join = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `${roomData}`, config);
  if (response.data) {
    localStorage.setItem("vish-chat-app-rooms", JSON.stringify(response.data));
  }
  setTimeout(() => {}, 2000);
  return response.data;
};
// leave
const leave = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + "leave", roomData, config);
  if (response.data) {
    localStorage.removeItem("vish-chat-app-rooms");
  }
  setTimeout(() => {}, 2000);
  return response.data;
};

// get users
const getUsers = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `users/${roomData}`, config);
  return response.data;
};
const roomService = {
  create,
  join,
  leave,
  getUsers,
};

export default roomService;
