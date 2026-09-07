import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHeart as faHeartS } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
export function StatIcon({ type }) {
  if (type === "like") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-button-text)]">
        <FontAwesomeIcon icon={faHeartS} className="h-2.5 w-2.5" />
      </span>
    );
  }
  return null;
}

export default function PostFooter({
  hasStats,
  localLikesCount,
  sharesCount,
  commentsCount,
  onComment,
  postId,
}) {

  const navigate = useNavigate();
  return (
    <>
      {hasStats && (
        <div className="flex items-center justify-between px-5 py-3 mt-1 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            {localLikesCount > 0 && (
              <>
                <StatIcon type="like" />
                <Link to={`/post-details/${postId}/likes`}>
                {localLikesCount} {localLikesCount === 1 ? "like" : "likes"}
                </Link>
              </>
            )}
          </span>
          <span className="flex items-center gap-3">
            {sharesCount > 0 && <span>{sharesCount} shares</span>}
            {commentsCount > 0 && (
              <button
                onClick={() => {navigate(`/post-details/${postId}`)}}
                className="hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
              </button>
            )}
          </span>
        </div>
      )}
    </>
  );
}
