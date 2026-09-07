import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import getUserProfile from "../Api/Auth/getUserProfile";
import toggleFollow from "../Api/Users/toggleFollow";
import getUserPosts from "../Api/Auth/getUserPosts"; // عدّل المسار حسب اللي عندك
import { calculateAge, formatJoinDate } from "../Utils/utils";
import PostCard from "../Components/Post/PostCard";
import profileNoPage from "../asset/profileNoPosts.png"; // عدّل المسار حسب مكان الصورة عندك

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center py-3">
      <span className="text-lg font-semibold text-[var(--color-text-primary)]">
        {value ?? 0}
      </span>
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
    </div>
  );
}

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile(userId);
        setUser(res.data.user);
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const res = await getUserPosts(userId);
        setPosts(res.posts || res.data || []);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
      fetchPosts();
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      await toggleFollow(userId);
      setIsFollowing((prev) => !prev);
      setUser((prev) => ({
        ...prev,
        followersCount: prev.followersCount + (isFollowing ? -1 : 1),
      }));
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <p className="text-center text-[var(--color-text-secondary)]">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <p className="text-center text-[var(--color-text-secondary)]">
          User not found.
        </p>
      </div>
    );
  }

  const {
    name,
    username,
    photo,
    cover,
    followersCount,
    followingCount,
    bookmarksCount,
    createdAt,
    dateOfBirth,
  } = user;

  return (
    <div className="max-w-2xl mx-auto pb-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 my-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        Back
      </button>

      {/* Cover */}
      <div
        className="h-40 rounded-card bg-accent-soft"
        style={
          cover
            ? {
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />

      {/* Header */}
      <div className="card -mt-10 relative">
        <div className="flex items-end justify-between">
          <img
            src={photo}
            alt={name}
            className="w-24 h-24 rounded-card object-cover border-4"
            style={{ borderColor: "var(--color-bg-card)" }}
          />
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={
              isFollowing
                ? "px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-page)] transition-colors duration-200 disabled:opacity-50"
                : "btn-primary disabled:opacity-50"
            }
          >
            {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-section">{name}</h1>
          <p className="text-text-secondary">@{username}</p>
        </div>

        <div className="flex gap-2 mt-3">
          {dateOfBirth && (
            <span className="chip">{calculateAge(dateOfBirth)} yrs</span>
          )}
          {createdAt && (
            <span className="chip">Joined {formatJoinDate(createdAt)}</span>
          )}
        </div>

        {/* Stats */}
        <div
          className="bento-grid mt-6"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          <StatBlock label="Followers" value={followersCount} />
          <StatBlock label="Following" value={followingCount} />
          <StatBlock label="Bookmarks" value={bookmarksCount} />
        </div>
      </div>

      {/* Posts */}
      {postsLoading ? (
        <p className="text-center text-text-secondary mt-6">Loading posts...</p>
      ) : posts && posts.length > 0 ? (
        <div className="flex flex-col gap-4 mt-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="card mt-6">
          <img
            src={profileNoPage}
            alt="profileNoPage"
            className="mt-3 w-full max-h-130 object-cover"
          />
          <p className="text-center text-text-secondary">
            No posts yet.
          </p>
        </div>
      )}
    </div>
  );
}