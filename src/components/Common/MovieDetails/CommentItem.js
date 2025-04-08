// CommentItem.js
import React from "react";

const CommentItem = ({
  comment,
  depth = 0,
  user,
  editingComment,
  editContent,
  setEditContent,
  handleUpdateComment,
  setEditingComment,
  replyingTo,
  handleReply,
  handleDeleteComment,
  replyContent,
  setReplyContent,
  handleSubmitComment,
  commentInputRef,
  formatDate,
  handleEdit,
  setReplyingTo,
}) => {
  const isOwner = user && comment.user._id === user._id;
  const isEditing = editingComment === comment._id;

  return (
    <div
      key={comment._id}
      className={`mt-4 ${
        depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      <div className="flex items-start">
        <img
          src={comment.user.avatar || "https://via.placeholder.com/40"}
          alt={comment.user.email}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">
                {comment.user.username} {isOwner && "(Bạn)"}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setEditingComment(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center mt-1 space-x-4 text-xs">
            {user && (
              <button
                onClick={() => handleReply(comment._id)}
                className="text-gray-500 hover:text-gray-700"
              >
                Phản hồi
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  Xóa
                </button>
              </>
            )}
          </div>

          {replyingTo === comment._id && (
            <div className="mt-3">
              <form onSubmit={handleSubmitComment}>
                <textarea
                  ref={commentInputRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết phản hồi..."
                  className="w-full p-2 border rounded"
                  rows="2"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Gửi
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              depth={depth + 1}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
