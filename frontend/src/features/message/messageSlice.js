import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import messageService from "./messageService";

const initialState = {
  messages: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// create messages
export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (messageData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await messageService.createMessage(messageData, token);
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
// get messages
export const getMessages = createAsyncThunk(
  "message/getMessages",
  async (messageData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await messageService.getMessages(messageData, token);
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
export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (messageData, thunkAPI) => {
    try {
      if (thunkAPI.getState().auth.user) {
        const token = thunkAPI.getState().auth.user.token;
        return await messageService.deleteMessage(messageData, token);
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

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = state.messages.filter(
          (msg) => msg._id !== action.payload.id
        );
      });
  },
});

export const messageSelector = (state) => state.message;
export default messageSlice.reducer;
export const { reset } = messageSlice.actions;
