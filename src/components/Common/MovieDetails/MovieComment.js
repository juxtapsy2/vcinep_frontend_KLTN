import React, { useState, useEffect, useRef } from "react";
import {
  addComment,
  getCommentsByMovie,
  deleteComment,
  updateComment,
} from "../../../api/CommentAPI";
import { reviewSenseGemini } from "../../../api/Gemini";
import { useAuth } from "../../../contexts/AuthContext";
import CommentItem from "./CommentItem";
import LoadingEffect from "../../LoadingEffect";
import toast from "react-hot-toast";
import { LogIn, MessageSquare, Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
const MovieComments = ({ movieId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const commentInputRef = useRef(null);
const location = useLocation();
  const slug = location.pathname.split("/movie/")[1];
  
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAIAnalysis = async () => {
    try {
      setIsLoading(true);
      setShowAIAnalysis(true);
      const result = await reviewSenseGemini(slug); // Using the extracted slug
      console.log(result);
      setAiResult(result.response);
      // console.log(result.)
    } catch (error) {
      console.error("Error analyzing comments:", error);
      setAiResult("Có lỗi xảy ra khi phân tích bình luận.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (replyingTo && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [replyingTo]);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByMovie(movieId);
      if (response.success) {
        const commentTree = buildCommentTree(response.data);
        setComments(commentTree);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const buildCommentTree = (comments) => {
    const commentMap = new Map();
    const roots = [];

    comments.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const commentNode = commentMap.get(comment._id);

      if (comment.parentComment && commentMap.has(comment.parentComment)) {
        const parentNode = commentMap.get(comment.parentComment);
        parentNode.replies.push(commentNode);
      } else {
        roots.push(commentNode);
      }
    });

    const sortByDate = (items) => {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      items.forEach((item) => {
        if (item.replies.length > 0) {
          item.replies = sortByDate(item.replies);
        }
      });
      return items;
    };

    return sortByDate(roots);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const contentToSubmit = replyingTo ? replyContent : newComment;
    if (!contentToSubmit.trim()) return;

    try {
      const response = await addComment(
        replyingTo, // parentCommentId
        movieId,
        user._id,
        contentToSubmit
      );

      if (response.success) {
        // Fetch lại toàn bộ comments để đảm bảo nhất quán
        await fetchComments();

        // Reset các state
        if (replyingTo) {
          setReplyContent("");
        } else {
          setNewComment("");
        }
        setReplyingTo(null);
      }
      toast.success("Bình luận thành công!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setEditingComment(null);
    setReplyContent("");
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 0);
  };

  const handleEdit = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
    setReplyingTo(null);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(commentId, editContent, "active");
      if (response.success) {
        await fetchComments(); // Fetch lại sau khi cập nhật
        setEditingComment(null);
      }
      toast.success("Cập nhật bình luận thành công!");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        await deleteComment(commentId);
        await fetchComments(); // Fetch lại sau khi xóa
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `${seconds} giây trước`;
    } else if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else if (days < 30) {
      return `${days} ngày trước`;
    } else if (months < 12) {
      return `${months} tháng trước`;
    } else {
      return `${years} năm trước`;
    }
  };

  return (
    <div className="bg-white rounded-xl transition-all duration-300">
       <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="inline-block w-1 h-8 mr-4 bg-gradient-to-b from-red-500 to-red-800 rounded-full" />
          <h1 className="text-2xl font-bold text-red-600 flex items-center">
            <MessageSquare className="mr-2 h-6 w-6" />
            Bình luận
          </h1>
        </div>

        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleAIAnalysis}
          >
            <Bot className="h-6 w-6" />
            <div className="absolute hidden group-hover:block -top-10 right-0 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
              Phân tích bình luận với AI
            </div>
          </motion.button>

          <AnimatePresence>
            {!isLoading && showAIAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
              >
                <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200" />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Phân tích bình luận AI
                  </h3>
                  <button
                    onClick={() => setShowAIAnalysis(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 max-h-60 overflow-y-auto custom-scrollbar">
                  {aiResult || "Chưa có kết quả phân tích"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
              <div className="absolute right-3 -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200" />
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-3">
          <div className="flex items-start">
            <img
              src={user.avatar || "https://via.placeholder.com/40"}
              alt={user.email}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-6 bg-white border-2 border-[#D0332F]/10 rounded-xl text-center shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <LogIn className="w-5 h-5 text-[#D0332F]" />
            <p className="text-gray-700 font-medium">
              Vui lòng{" "}
              <span className="text-[#D0332F] hover:text-[#D0332F]/80 cursor-pointer">
                đăng nhập
              </span>{" "}
              để bình luận
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              editingComment={editingComment}
              editContent={editContent}
              setEditContent={setEditContent}
              handleUpdateComment={handleUpdateComment}
              setEditingComment={setEditingComment}
              replyingTo={replyingTo}
              handleReply={handleReply}
              handleDeleteComment={handleDeleteComment}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleSubmitComment={handleSubmitComment}
              commentInputRef={commentInputRef}
              formatDate={formatDate}
              handleEdit={handleEdit}
              setReplyingTo={setReplyingTo}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <MessageSquare className="w-12 h-12 text-[#D0332F]/30 mb-3" />
            <p className="text-gray-500 font-medium">Chưa có bình luận nào</p>
            <p className="text-sm text-gray-400 mt-1">
              Hãy là người đầu tiên bình luận
            </p>
          </div>
        )}
      </div>
       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default MovieComments;
