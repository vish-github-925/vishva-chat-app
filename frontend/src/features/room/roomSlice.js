import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roomService from "./roomService";

// reading room data
const roomData = JSON.parse(localStorage.getItem("vish-chat-app-rooms"));
const initialState = {
  room: roomData ? roomData : null,
  roomUsers: [],
  isSuccess: false,
  isLoading: false,
  message: "",
  isError: false,
};

// extra reducers
// join room
export const joinRoom = createAsyncThunk(
  "room/joinRoom",
  async (roomData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await roomService.join(roomData, token);
      }
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// create room
export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (roomData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await roomService.create(roomData, token);
      }
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// leave room
export const leaveRoom = createAsyncThunk(
  "room/leaveRoom",
  async (roomData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await roomService.leave(roomData, token);
      }
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// get roomusers
export const getRoomUsers = createAsyncThunk(
  "room/getRoomUsers",
  async (roomData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await roomService.getUsers(roomData, token);
      }
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.room = action.payload;
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.room = null;
      })
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.room = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.room = null;
      })
      .addCase(getRoomUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoomUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.roomUsers = action.payload;
      })
      .addCase(getRoomUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.roomUsers = [];
      })
      .addCase(leaveRoom.fulfilled, (state) => {
        state.room = null;
      });
  },
});
export default roomSlice.reducer;
export const { reset } = roomSlice.actions;
export const roomSelector = (state) => state.room;
