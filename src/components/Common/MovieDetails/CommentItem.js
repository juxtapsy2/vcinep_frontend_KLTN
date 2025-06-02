import React from "react";
import { Send, X, Clock } from "lucide-react";

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
    <div key={comment._id} className="mt-3">
      <div className="flex items-start gap-2">
        <div className="relative">
          <img
            src={comment.user?.avatar || "https://via.placeholder.com/40"}
            alt={comment.user?.email}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
          {depth > 0 && (
            <div className="absolute w-10 h-10 -left-12 -top-5 border-l-2 border-b-2 border-[#F1F2F5] rounded-bl-2xl" />
          )}
        </div>

        <div className="flex-1">
          <div className="bg-[#F0F2F5] rounded-xl p-3 inline-block min-w-[250px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">
                {comment.user.username}
              </span>
              {isOwner && (
                <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">
                  Bạn
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3 rounded-xl  inline-block min-w-[600px]">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-100 rounded-xl outline-none transition-colors resize-none rounded-xl p-3 inline-block min-w-[250px]"
                  rows="3"
                  placeholder="Chỉnh sửa bình luận..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingComment(null)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors gap-1"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors gap-1"
                  >
                    <Send className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-black text-sm text-base leading-relaxed">
                {comment.content}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-400">
              <time className="text-xs">{formatDate(comment.createdAt)}</time>
            </div>
            {user && (
              <button
                onClick={() => handleReply(comment._id)}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-red-500 transition-colors gap-1 group"
              >
                Phản hồi
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => handleEdit(comment)}
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-red-500 transition-colors gap-1 group"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-red-500 transition-colors gap-1 group"
                >
                  Xóa
                </button>
              </>
            )}
          </div>

          {replyingTo === comment._id && (
            <div className="mt-3 bg-[#F1F2F5] rounded-2xl p-4">
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <textarea
                  ref={commentInputRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết phản hồi của bạn..."
                  className="w-full p-3 text-sm border border-gray-100 rounded-xl outline-none transition-colors resize-none"
                  rows="3"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors gap-1"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors gap-1"
                  >
                    <Send className="w-4 h-4" />
                    Gửi phản hồi
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-14">
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
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
