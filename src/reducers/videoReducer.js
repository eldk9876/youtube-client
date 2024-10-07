import { getVideos, getVideo } from "../api/video";

export const initState = {
  video: null,
  videos: [],
};

// 액션 함수들
export const fetchVideo = async (dispatch, videoCode) => {
  const response = await getVideo(videoCode);
  dispatch({ type: "FETCH_VIDEO", payload: response.data });
};

// fetchVideos - FETCH_VIDEOS
export const fetchVideos = async (dispatch, page, keyword) => {
  const response = await getVideos(page, keyword);
  dispatch({ type: "FETCH_VIDEOS", payload: response.data });
};

export const videoReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_VIDEO":
      return { ...state, video: action.payload };
    case "FETCH_VIDEOS":
      return { ...state, videos: action.payload };
  }
};

// {
//     "videoCode": 2,
//     "videoUrl": "http://192.168.10.51:8082/video/AKMU1.mp4",
//     "videoImg": "http://192.168.10.51:8082/thumbnail/akmu.webp ",
//     "videoTitle": "AKMU - 후라이의 꿈 LIVE CLIP (FESTIVAL ver.) ",
//     "videoCount": 3,
//     "videoDate": "2024-08-20T11:38:44",
//     "videoDesc": "More about AKMU ",
//     "channel": {
//         "channelCode": 2,
//         "channelImg": "http://192.168.10.51:8082/channel/akmu.jpg",
//         "channelName": "AKMU",
//         "id": "akmu"
//     }
// }
