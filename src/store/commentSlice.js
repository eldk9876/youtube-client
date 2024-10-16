import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addComment,
  viewComments,
  updateComment,
  deleteComment,
} from "../api/comment";

export const createComment = createAsyncThunk(
  "comment/createComment",
  async (data, thunkAPI) => {
    await addComment(data);
    thunkAPI.dispatch(fetchComments(data.videoCode));
  }
);

export const modifyComment = createAsyncThunk(
  "comment/modifyComment",
  async (data, thunkAPI) => {
    await updateComment(data);
    thunkAPI.dispatch(fetchComments(data.videoCode));
  }
);

export const removeComment = createAsyncThunk(
  "comment/removeComment",
  async (data, thunkAPI) => {
    await deleteComment(data.commentCode);
    thunkAPI.dispatch(fetchComments(data.videoCode));
  }
);

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (videoCode) => {
    const response = await viewComments(videoCode);
    return response.data;
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState: { comments: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
  },
});

export default commentSlice;
