import "../../assets/detail.css";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import {
  initState as videoState,
  videoReducer,
  fetchVideo,
  fetchVideos,
} from "../../reducers/videoReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribe,
  unsubscribe,
  subCount,
  fetchSub,
} from "../../store/subscribeSlice";
import { createComment, fetchComments } from "../../store/commentSlice";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import Comment from "../../components/Comment";

// 리액트 쿼리(React Query)
// 서버에 데이터에 특화되어 비동기 작업을 훨씬 쉽게 처리할 수 있는 라이브러리
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment as addCommentAPI, viewComments } from "../../api/comment";

const Detail = () => {
  const { videoCode } = useParams();
  const { token, id } = useAuth();

  const [isComment, setIsComment] = useState(false);
  const [newComment, setNewComment] = useState({
    commentText: "",
    videoCode: videoCode,
    id: id,
  });

  // 리듀서 방식 - 리덕스 툴킷 사용하는 방식으로 변경해보셔도 괜찮아요!
  // 실제 프로젝트에서는 하나로 통일해주세요! -> 만약 쓰신다면 리덕스 툴킷 사용!
  const [state, videoDispatch] = useReducer(videoReducer, videoState);
  const { video, videos } = state;

  // 리덕스 툴킷 방식 - 구독
  const dispatch = useDispatch();

  const isSub = useSelector((state) => state.subscribe.isSub);
  const count = useSelector((state) => state.subscribe.count);
  const sub = useSelector((state) => state.subscribe.sub);

  // 리액트 쿼리 방식 -> 필수는 아님! 굳이 사용할 필요는 없어요~
  // queryClient : React Query의 캐시를 제어
  const queryClient = useQueryClient();

  // 댓글 목록
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", videoCode],
    queryFn: () => viewComments(videoCode),
    refetchInterval: 1000, // 1000 = 1초 -> 해당 시간마다 데이터 갱신하여 실시간처럼 처리
  });

  // 댓글 추가
  const addMutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoCode] });
    },
  });

  const handleSub = () => {
    if (isSub) {
      dispatch(unsubscribe(sub.subCode));
    } else {
      // 구독 -> 구독
      dispatch(subscribe({ channelCode: video.channel.channelCode }));
    }
  };

  // 댓글 추가
  const addComment = () => {
    addMutation.mutate(newComment);
    setIsComment(false);
    setNewComment({ ...newComment, commentText: "" });
  };

  useEffect(() => {
    fetchVideo(videoDispatch, videoCode);
    fetchVideos(videoDispatch, 1, "");
  }, []);

  useEffect(() => {
    if (video != null) {
      dispatch(subCount(video.channel.channelCode));
      if (token != null) {
        dispatch(fetchSub(video.channel.channelCode));
      }
    }
  }, [video, token]);

  // 데이터 로딩 중일 때 처리
  if (isLoading) return <>로딩중..</>;
  // 에러 발생 했을 때 처리
  if (error) return <>에러 발생..</>;

  return (
    <main className="detail">
      <div className="video-detail">
        <video controls src={video?.videoUrl}></video>
        <h2>{video?.videoTitle}</h2>
        <div className="video-detail-desc">
          <div className="detail-desc-left">
            <img src={video?.channel.channelImg} />
            <div className="channel-desc">
              <h3>{video?.channel.channelName}</h3>
              <p>구독자 {count}명</p>
            </div>
            <button onClick={handleSub}>{isSub ? "구독중" : "구독"}</button>
          </div>
        </div>
        <div className="video-detail-info">{video?.videoDesc}</div>
        <div className="comment">
          <input
            className="comment-add"
            type="text"
            placeholder="댓글 추가.."
            value={newComment.commentText}
            onChange={(e) =>
              setNewComment({ ...newComment, commentText: e.target.value })
            }
            onClick={() => setIsComment(true)}
          />
          {isComment && (
            <div className="comment-add-status">
              <button onClick={() => setIsComment(false)}>취소</button>
              <button onClick={addComment}>댓글</button>
            </div>
          )}
          <div className="comment-list">
            {comments.data.map((comment) => (
              <Comment
                comment={comment}
                videoCode={videoCode}
                key={comment.commentCode}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="video-list">
        {videos.map((video) => (
          <a
            href={`/video/${video.videoCode}`}
            className="video-list-card"
            key={video.videoCode}
          >
            <img src={video.videoImg} />
            <div className="video-list-desc">
              <h4>{video.videoTitle}</h4>
              <p>{video.channel.channelName}</p>
              <p className="video-meta">조회수 {video.videoCount}회</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
};
export default Detail;
