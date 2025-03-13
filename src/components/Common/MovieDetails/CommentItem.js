import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
const CommentItem = ({
  comment,
  currentUser,
  onEdit,
  onDelete,
  openMenuId,
  onMenuClick,
}) => {
  const [editContent, setEditContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditContent(comment?.content);
    onMenuClick(null);
  };

  const handleSaveEdit = () => {
    onEdit(comment?._id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="group relative flex gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm  transition-all duration-300 hover:border-red-200">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-200 group-hover:border-red-400 transition-colors duration-300">
          <img
            src={comment.user?.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {comment.user?.email.split("@")[0]}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 italic">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
            {currentUser && currentUser?._id === comment.user?._id && (
              <div className="relative">
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-all duration-300"
                  onClick={() => onMenuClick(comment?._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
                {openMenuId === comment?._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleEditClick}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => onDelete(comment?._id)}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-b-lg"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded-lg focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1 text-sm text-white bg-red-500 rounded-full hover:bg-red-600"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-800 transition-colors duration-300">
            {comment?.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
