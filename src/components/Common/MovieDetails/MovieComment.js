import React, { useState, useEffect, useRef } from "react";
import * as CommentAPI from "../../../api/CommentAPI";
import { useAuth } from "../../../contexts/AuthContext";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import LoadingEffect from "../../LoadingEffect";

const MovieComments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const { user } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await CommentAPI.getCommentsByMovie(movieId);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      loadComments();
    }
  }, [movieId]);

  const handleEditComment = async (commentId, content) => {
    if (!content.trim()) return;

    try {
      const response = await CommentAPI.updateComment(
        commentId,
        content,
        "active"
      );
      if (response.success) {
        await loadComments();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        const response = await CommentAPI.deleteComment(commentId);
        if (response.success) {
          await loadComments();
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingEffect />; // Thay thế phần hiệu ứng tải bằng LoadingEffect
  }

  return (
    <div className="bg-white rounded-xl transition-all duration-300">
      <h1 className="text-2xl font-bold text-red-600 mb-8 flex items-center">
        <span className="inline-block w-1 h-8 mr-4 bg-gradient-to-b from-red-500 to-red-800" />
        Bình luận
      </h1>
      <CommentInput movieId={movieId} onCommentAdded={loadComments} />
      <CommentList
        comments={comments}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        user={user}
        openMenuId={openMenuId}
        onMenuClick={setOpenMenuId}
      />
    </div>
  );
};

export default MovieComments;
