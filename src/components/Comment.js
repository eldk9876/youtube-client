import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
// import { useDispatch, useSelector } from "react-redux"; 
// import {
//   createComment,
//   modifyComment,
//   removeComment,
// } from "../store/commentSlice"; // 리덕스 사용
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, updateComment, deleteComment as delComment } from "../api/comment";


const Comment = ({ comment, videoCode }) => {
  const queryClient = useQueryClient();
  // const dispatch = useDispatch();
  const { id } = useAuth();
  const [newReply, setNewReply] = useState({
    commentCode: 0,
    commentText: "",
    videoCode: videoCode,
    id: id,
    parentCode: 0,
  });



  // 댓글 추가
  const addmutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {                // onSuccess <- 성공했을때
        queryClient.invalidateQueries({queryKey: ["comments", videoCode]});
    },
  });

    // 댓글 추가
    const editmutation = useMutation({
      mutationFn: updateComment,
      onSuccess: () => {                // onSuccess <- 성공했을때
          queryClient.invalidateQueries({queryKey: ["comments", videoCode]});
      },
    });

      // 댓글 추가
  const delmutation = useMutation({
    mutationFn: delComment,
    onSuccess: () => {                // onSuccess <- 성공했을때
        queryClient.invalidateQueries({queryKey: ["comments", videoCode]});
    },
  });


  // 대댓글 추가
  const addReply = () => {
    addmutation.mutate(newReply);
    setNewReply({ ...newReply, commentText: "", parentCode: 0 });
  };
  const deleteComment = (commentCode) => {
    // dispatch(removeComment({ videoCode, commentCode })); // 명칭 가능할시 dispatch(removeComment({videoCode : videoCode, commentCode: commentCode}))생략 가능 리덕스
    delmutation.mutate({ commentCode });
  };


  const edit = (commentId, commentText, commentCode) => {
    if (id === commentId) {
      setNewReply({ ...newReply, commentText, commentCode });
    }
  };
  const editCancle = () => {
    setNewReply({ ...newReply, commentText: "", commentCode: 0 });
  };

  const editSubmit = () => {
    editmutation.mutate(newReply);
    // dispatch(modifyComment(newReply));
    editCancle();
  };


    // 데이터 로딩 중일 때 처리
    if (isLoading) return <>로딩중..</>;

    // 에러 발생 했을 때 처리
    if (error) return <>에러 </>;


  return (
        <div className="comment-content">
          {comment.delete ? ( <p> 삭제된 댓글입니다..</p> 
          ) : (
            <>
            {""}

          <h4>{comment.id}</h4>
          {newReply.commentCode === comment.commentCode ? (
            <>
              <input
                type="text"
                value={newReply.commentText}
                onChange={(e) =>
                  setNewReply({
                    ...newReply,
                    commentText: e.target.value,
                    commentCode: comment.commentCode,
                  })
                }
              />
              <div class Name="edit-content">
                <button onClick={editCancle}>취소</button>
                <button onClick={editSubmit}>수정</button>
              </div>
            </>
          ) : (
            <p onClick={() => edit(comment.id)}>{comment.commentText, comment.commentCode}</p>
          )}

          <button
            onClick={() =>
              setNewReply({
                ...newReply,
                parentCode: comment.commentCode,
              })
            }
          >
            답글
          </button>
          {id === comment.id && (
            <button onClick={() => deleteComment(comment.commentCode)}>
              삭제
            </button>
            
          )}
   </>



          
          {newReply.parentCode === comment.commentCode && (
            <>
              <input
                type="text"
                placeholder="답글 추가.."
                value={newReply.commentText}
                onChange={(e) =>
                  setNewReply({
                    ...newReply,
                    commentText: e.target.value,
                  })
                }
              />
              <div className="reply-add-status">
                <button
                  onClick={() =>
                    setNewReply({
                      ...newReply,
                      commentText: "",
                      parentCode: 0,
                    })
                  }
                >
                  취소
                </button>
                <button onClick={addReply}>답글</button>
              </div>
            </>
          )}
          {comment.relies?.map((reply) => (
            <Comment
              comment={reply}
              videoCode={videoCode}
              key={reply.commentCode}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
export default Comment;
