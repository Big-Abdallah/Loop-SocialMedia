import React, { useState, useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import CardHeader, { PrivacyBadge } from "./CardHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import CreatePostModal from "./CreatePostModal";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../Utils/utils";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import toggleBookmark from "../../Api/Users/toggleBookmark";
import toggleLike from "../../Api/Posts/toggleLike";
import deletePostApi from "../../Api/Posts/CrudOperations/deletePost";
import createCommentApi from "../../Api/Comments/createComment";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { getProfileContext } from "../../Contexts/getProfileContext";
import ShareModal from "./ShareModal";

export default function PostCard({ post, onComment, onDeleted, onUpdated }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const { id: currentUserId, photo: currentUserPhoto } = useContext(getProfileContext);
  const [bookmarked, setBookmarked] = useState(post?.bookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [liked, setLiked] = useState(post?.likes?.includes(currentUserId) || false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  // كومنت مباشر من الفيد
  const [localTopComment, setLocalTopComment] = useState(post?.topComment || null);
  const [commentText, setCommentText] = useState("");
  const [commentImageFile, setCommentImageFile] = useState(null);
  const [commentImagePreview, setCommentImagePreview] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    setBookmarkLoading(true);
    try {
      await toggleBookmark(id);
      setBookmarked((prev) => !prev);
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    setLikeLoading(true);
    const prevLiked = liked;
    setLiked(!prevLiked);
    setLocalLikesCount((prev) => (prevLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike(id);
    } catch (err) {
      console.error("Error toggling like:", err);
      setLiked(prevLiked);
      setLocalLikesCount((prev) => (prevLiked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  async function handleDelete(e) {
    e.stopPropagation();
    setDeleting(true);
    setMenuOpen(false);
    try {
      await deletePostApi(id);
      onDeleted?.(id);
    } catch (err) {
      console.error("Error deleting post:", err);
      window.alert("Couldn't delete the post. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  function handlePostUpdated(updatedPost) {
    onUpdated?.(updatedPost);
  }

  function handleCommentImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCommentImageFile(file);
    setCommentImagePreview(URL.createObjectURL(file));
  }

  function removeCommentImage() {
    setCommentImageFile(null);
    setCommentImagePreview(null);
  }

  async function handleSubmitComment() {
    if (!commentText.trim() && !commentImageFile) return;
    setSubmittingComment(true);
    try {
      const res = await createCommentApi(id, commentText.trim(), commentImageFile);
      if (res?.message && !res?._id) {
        throw new Error(res.message);
      }
      setLocalTopComment(res);
      setCommentText("");
      removeCommentImage();
    } catch (err) {
      console.error("Error creating comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  }

  const {
    body,
    createdAt,
    likesCount = 0,
    commentsCount = 0,
    sharesCount = 0,
    privacy = "public",
    isShare,
    sharedPost,
    image,
    user,
    id,
  } = post || {};
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  const name = user?.name || "Unknown";
  const hasStats = localLikesCount > 0 || sharesCount > 0 || commentsCount > 0;
  const isOwner = (user?._id || user?.id) === currentUserId;

  function goToDetails() {
    navigate(`/post-details/${id}`);
  }

  return (
    <article className="relative rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
      {isOwner && (
        <div className="absolute top-3 right-3 z-10" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            disabled={deleting}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-primary)] transition-colors duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-9 w-36 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 shadow-sm"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowEditModal(true);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-accent-soft)] transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-[var(--color-accent-soft)] transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* المنطقة القابلة للضغط — header + body بس */}
      <div >
        {isShare && (
          <p className="px-5 pt-4 text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 stroke-current fill-none stroke-[1.8]">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
              />
            </svg>
            <span className="font-semibold text-[var(--color-text-primary)]">{name}</span>
            shared a post
          </p>
        )}

        <CardHeader user={user} name={name} createdAt={createdAt} privacy={privacy} />

        <PostBody body={body} image={image}  className="cursor-pointer" postId={id} />

        {isShare && sharedPost && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post-details/${sharedPost._id}`);
            }}
            className="mx-5 my-3 rounded-[var(--radius-card)] border border-[var(--color-border)] overflow-hidden cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors duration-200"
          >
            <div className="p-4 flex gap-3">
              <img
                src={sharedPost.user?.photo}
                alt={sharedPost.user?.name}
                className="h-8 w-8 rounded-full object-cover "
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {sharedPost.user?.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                  @{sharedPost.user?.username} · {timeAgo(sharedPost.createdAt)} ·{" "}
                  <PrivacyBadge privacy={sharedPost.privacy} />
                </p>
              </div>
            </div>
            <PostBody body={sharedPost.body} image={sharedPost.image} />
          </div>
        )}

        <PostFooter
          hasStats={hasStats}
          localLikesCount={localLikesCount}
          sharesCount={sharesCount}
          commentsCount={commentsCount}
          onComment={onComment}
          postId={id}
        />
      </div>

      {/* الأزرار */}
      <div className="flex items-center border-t border-[var(--color-border)] mx-5 mb-2">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-200 disabled:opacity-50 ${
            liked ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          }`}
        >
          <FontAwesomeIcon icon={liked ? faHeartSolid : faHeart} className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShareModal(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faShareFromSquare} className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {showShareModal && (
          <ShareModal
            post={post}
            onClose={() => setShowShareModal(false)}
            onShared={(newPost) => {
              console.log("تم مشاركة البوست:", newPost);
            }}
          />
        )}

        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-200 disabled:opacity-50 ${
            bookmarked ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          }`}
        >
          <FontAwesomeIcon icon={bookmarked ? faBookmarkSolid : faBookmarkRegular} className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Create Comment Section — مباشرة من الفيد */}
      <div onClick={(e) => e.stopPropagation()} className="px-5 pb-4">
        {localTopComment && (
          <div
            className="flex gap-2 mb-3 cursor-pointer"
          >
            <img
              src={localTopComment.commentCreator?.photo}
              alt={localTopComment.commentCreator?.name}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 rounded-2xl bg-[var(--color-bg-page)] px-3 py-1.5">
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                {localTopComment.commentCreator?.name || "Unknown"}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {localTopComment.content}
              </p>
            </div>
          </div>
        )}

        {commentsCount > 1 && (
          <button
            
            className="text-xs font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-200 mb-3"
          >
            View all {commentsCount} comments
          </button>
        )}

        <div className="flex gap-2">
          <img
            src={currentUserPhoto}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-page)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200"
              />

              <label className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full border border-[var(--color-border)] cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors duration-200">
                <input type="file" accept="image/*" onChange={handleCommentImageChange} className="hidden" />
                <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.8]">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </label>

              <button
                onClick={handleSubmitComment}
                disabled={submittingComment || (!commentText.trim() && !commentImageFile)}
                className="shrink-0 text-sm font-medium text-[var(--color-accent)] disabled:opacity-50"
              >
                {submittingComment ? "..." : "Post"}
              </button>
            </div>

            {commentImagePreview && (
              <div className="relative mt-2 inline-block">
                <img
                  src={commentImagePreview}
                  alt="preview"
                  className="h-16 w-16 object-cover rounded-[var(--radius-card)]"
                />
                <button
                  onClick={removeCommentImage}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <CreatePostModal
          existingPost={post}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </article>
  );
}