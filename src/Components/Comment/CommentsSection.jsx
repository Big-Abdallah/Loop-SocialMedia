import React, { useState, useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { timeAgo } from "../../Utils/utils";
import getPostComments from "../../Api/Posts/getPostComments";
import updateCommentApi from "../../Api/Comments/updateComment";
import deleteCommentApi from "../../Api/Comments/deleteComment";
import getCommentRepliesApi from "../../Api/Comments/getCommentReplies";
import addReplyApi from "../../Api/Comments/addReply";
import { getProfileContext } from "../../Contexts/getProfileContext";
import toggleCommentLikeApi from "../../Api/Comments/toggleLike";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";


function RepliesSection({ postId, commentId }) {
  const [replies, setReplies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
 
  async function handleToggleReplies() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    if (!loaded) {
      setLoading(true);
      try {
        const res = await getCommentRepliesApi(postId, commentId, 1, 10);
        setReplies(Array.isArray(res) ? res : res?.replies || []);
        setLoaded(true);
      } catch (err) {
        console.error("Error fetching replies:", err);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(true);
  }
 
  return (
    <div className="mt-2">
      <button
        onClick={handleToggleReplies}
        disabled={loading}
        className="text-xs font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-200 disabled:opacity-50"
      >
        {loading ? "Loading..." : expanded ? "Hide replies" : "View replies"}
      </button>
 
      {expanded && (
        <div className="mt-3 flex flex-col gap-3 border-l-2 border-[var(--color-border)] pl-3">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <CommentRow key={reply._id} comment={reply} postId={postId} isReply />
            ))
          ) : (
            <p className="text-xs text-[var(--color-text-secondary)]">No replies yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
 
function CommentRow({ comment, postId, onDeleted, onUpdated, isReply = false }) {
  const { id: currentUserId } = useContext(getProfileContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
 
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImageFile, setReplyImageFile] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);
 
  const menuRef = useRef(null);
 
  const [liked, setLiked] = useState(comment.likes?.includes(currentUserId) || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || comment.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
 
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const isOwner = (comment.commentCreator?._id || comment.commentCreator?.id) === currentUserId;
 
  async function handleSaveEdit() {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      const res = await updateCommentApi(postId, comment._id, editText.trim());
      onUpdated?.(res || { ...comment, content: editText.trim() });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating comment:", err);
    } finally {
      setSaving(false);
    }
  }
 
  async function handleDelete() {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;
    setDeleting(true);
    setMenuOpen(false);
    try {
      await deleteCommentApi(postId, comment._id);
      onDeleted?.(comment._id);
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeleting(false);
    }
  }
 
  function handleReplyImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplyImageFile(file);
    setReplyImagePreview(URL.createObjectURL(file));
  }
 
  function removeReplyImage() {
    setReplyImageFile(null);
    setReplyImagePreview(null);
  }
 
  async function handleSendReply() {
    if (!replyText.trim() && !replyImageFile) return;
    setSendingReply(true);
    try {
      await addReplyApi(postId, comment._id, replyText.trim(), replyImageFile);
      setReplyText("");
      removeReplyImage();
      setShowReplyBox(false);
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setSendingReply(false);
    }
  }
 
  async function handleToggleLike() {
    setLikeLoading(true);
    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikesCount((prev) => (prevLiked ? prev - 1 : prev + 1));
 
    try {
      await toggleCommentLikeApi(postId, comment._id);
    } catch (err) {
      console.error("Error toggling comment like:", err);
      setLiked(prevLiked);
      setLikesCount((prev) => (prevLiked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  }
 
  if (deleting) return null;
 
  return (
    <div className="relative rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-page)] p-3">
      <div className="flex gap-3">
        <img
          src={comment.commentCreator?.photo}
          alt={comment.commentCreator?.name}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {comment.commentCreator?.name || "Unknown"}
              </p>
              <span className="text-xs text-[var(--color-text-secondary)] shrink-0">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
 
            {isOwner && (
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-6 w-6 flex items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faEllipsis} className="h-3.5 w-3.5" />
                </button>
 
                {menuOpen && (
                  <div className="absolute right-0 top-7 w-32 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1 shadow-sm z-10">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsEditing(true);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-accent-soft)] transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-[var(--color-accent-soft)] transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
 
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200"
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="text-xs font-medium text-[var(--color-accent)] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                  className="text-xs font-medium text-[var(--color-text-secondary)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                {comment.content}
              </p>
              {comment.image && (
                <img
                  src={comment.image}
                  alt="comment attachment"
                  className="mt-2 max-h-60 rounded-[var(--radius-card)] object-cover"
                />
              )}
            </>
          )}
 
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleToggleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1 text-xs font-medium transition-colors duration-200 disabled:opacity-50 ${
                liked
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              }`}
            >
              <FontAwesomeIcon icon={liked ? faHeartSolid : faHeart} className="h-3.5 w-3.5" />
              {likesCount > 0 ? likesCount : "Like"}
            </button>
 
            {!isReply && (
              <button
                onClick={() => setShowReplyBox((v) => !v)}
                className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                Reply
              </button>
            )}
          </div>
 
          {showReplyBox && (
            <div className="mt-2">
              <div className="flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200"
                />
 
                <label className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full border border-[var(--color-border)] cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReplyImageChange}
                    className="hidden"
                  />
                  <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.8]">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </label>
 
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || (!replyText.trim() && !replyImageFile)}
                  className="text-xs font-medium text-[var(--color-accent)] disabled:opacity-50 shrink-0"
                >
                  {sendingReply ? "..." : "Send"}
                </button>
              </div>
 
              {replyImagePreview && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={replyImagePreview}
                    alt="reply preview"
                    className="h-20 w-20 object-cover rounded-[var(--radius-card)]"
                  />
                  <button
                    onClick={removeReplyImage}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
 
          {!isReply && (comment.repliesCount > 0 || comment.hasReplies) && (
            <RepliesSection postId={postId} commentId={comment._id} />
          )}
        </div>
      </div>
    </div>
  );
}
 
export default function CommentsSection({ postId, topComment, commentsCount = 0 }) {
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [localTopComment, setLocalTopComment] = useState(topComment);
 
  const handleShowMoreComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await getPostComments(postId);
      setComments(Array.isArray(res) ? res : res.comments || []);
      setShowAllComments(true);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };
 
  function handleCommentDeleted(commentId) {
    if (showAllComments) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } else if (localTopComment?._id === commentId) {
      setLocalTopComment(null);
    }
  }
 
  function handleCommentUpdated(updatedComment) {
    if (showAllComments) {
      setComments((prev) =>
        prev.map((c) => (c._id === updatedComment._id ? { ...c, ...updatedComment } : c))
      );
    } else if (localTopComment?._id === updatedComment._id) {
      setLocalTopComment((prev) => ({ ...prev, ...updatedComment }));
    }
  }
 
  const list = (showAllComments ? comments : [localTopComment]).filter(Boolean);
  const hasAnyComments = list.length > 0;
 
  return (
    <div className="border-t border-[var(--color-border)] px-5 py-4">
      {hasAnyComments ? (
        <div className="flex flex-col gap-3">
          {list.map((comment) => (
            <CommentRow
              key={comment._id}
              comment={comment}
              postId={postId}
              onDeleted={handleCommentDeleted}
              onUpdated={handleCommentUpdated}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">No comments yet.</p>
      )}
 
      {!showAllComments && commentsCount > 1 && (
        <button
          onClick={handleShowMoreComments}
          disabled={commentsLoading}
          className="mt-3 text-sm font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-200 disabled:opacity-50"
        >
          {commentsLoading ? "Loading..." : `View all ${commentsCount} comments`}
        </button>
      )}
    </div>
  );
}