import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import * as CommentAPI from "../../../api/CommentAPI";
import { useAuth } from "../../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const CommentInput = ({ movieId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useAuth();
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiObject) => {
    setContent((prevContent) => prevContent + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await CommentAPI.addComment(movieId, user._id, content);
      if (response.success) {
        setContent("");
        onCommentAdded();
        toast.success("Bình luận đã được thêm !");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">Vui lòng đăng nhập để bình luận</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl mb-4 transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-200">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn..."
              className="w-full min-h-[120px] p-4 rounded-lg border-2 border-gray-100 
                focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all
                outline-none resize-none text-gray-700 placeholder-gray-400
                hover:border-red-200"
            />

            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span role="img" aria-label="emoji" className="text-xl">
                  😊
                </span>
              </button>

              <span className="text-sm text-gray-400">
                {content.length}/1000
              </span>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className={`px-6 py-2 rounded-full font-medium text-white
                  transform transition-all duration-300
                  ${
                    isSubmitting || !content.trim()
                      ? "bg-gray-300 cursor-not-allowed opacity-50"
                      : "bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  "Bình luận"
                )}
              </button>
            </div>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-16 right-0 z-50"
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
