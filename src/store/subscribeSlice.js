import { addSub, removeSub, countSub, getSub } from "../api/subscribe";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const subscribe = createAsyncThunk(
  "subscribe/subscribe",
  async (data) => {
    const response = await addSub(data);
    return response.data;
  }
);

export const unsubscribe = createAsyncThunk(
  "subscribe/unsubscribe",
  async (subCode) => {
    const response = await removeSub(subCode);
    return response.data;
  }
);

export const subCount = createAsyncThunk(
  "subscribe/subCount",
  async (channelCode) => {
    const response = await countSub(channelCode);
    return response.data;
  }
);

export const fetchSub = createAsyncThunk(
  "subscribe/fetchSub",
  async (channelCode) => {
    const response = await getSub(channelCode);
    return response.data;
  }
);

const subscribeSlice = createSlice({
  name: "subscribe",
  initialState: {
    count: 0, // 구독자 수
    isSub: false, // 구독 체크 여부
    sub: null, // 구독 정보
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribe.fulfilled, (state, action) => {
        // 구독 성공 시 상태 업데이트
        state.sub = action.payload;
        state.isSub = true;
        state.count += 1; // 구독자 수 증가
      })
      .addCase(unsubscribe.fulfilled, (state, action) => {
        // 구독 해지 시 상태 업데이트
        state.isSub = false;
        state.count -= 1; // 구독자 수 감소
        state.sub = null;
      })
      .addCase(subCount.fulfilled, (state, action) => {
        // 구독자 수 업데이트
        state.count = action.payload;
      })
      .addCase(fetchSub.fulfilled, (state, action) => {
        // 구독 정보 가져오기
        if (action.payload === "") {
          state.isSub = false;
          state.sub = null;
        } else {
          state.isSub = true;
          state.sub = action.payload;
        }
      })
      .addCase(fetchSub.rejected, (state) => {
        // 구독 정보 가져오기 실패 시 상태 업데이트
        state.isSub = false;
        state.sub = null;
      });
  },
});

export default subscribeSlice.reducer; // reducer를 내보내기
