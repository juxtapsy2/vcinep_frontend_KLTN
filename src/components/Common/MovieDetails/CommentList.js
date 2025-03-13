import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({
  comments,
  onEdit,
  onDelete,
  user,
  openMenuId,
  onMenuClick,
}) => {
  if (comments?.length === 0) {
    return (
      <div className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-lg">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUser={user}
          onEdit={onEdit}
          onDelete={onDelete}
          openMenuId={openMenuId}
          onMenuClick={onMenuClick}
        />
      ))}
    </div>
  );
};

export default CommentList;
