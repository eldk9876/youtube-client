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
  async (data) => {
    await updateComment(data);
    thunkApi.dispatch(fatchComment(data.videoCode));
  }
);

export const removeComment = createAsyncThunk(
  "comment/removeComment",
  async (commentCode, thunkAPI) => {
    await deleteComment(data.commentCode);
    thunkAPI.dispatch(fetchComments(data.videoCode));
  }
);

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (video) => {
    const response = await viewComments(video);
    return response.data;
  }
);

const commentSlice = createSlice({
  name: "commnet",
  initialState: { comments: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
  },
});

export default commentSlice;
