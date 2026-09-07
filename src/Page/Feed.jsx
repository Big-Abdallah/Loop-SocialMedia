import React, { useState, useEffect } from "react";
import getAllPostsApi from "../Api/Posts/getAllPost";
import PostCard from "../Components/Post/PostCard";
import PostSkeleton from "../Components/Post/PostSkeleton";
import CreatePostModal from "../Components/Post/CreatePostModal";
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false)
  async function getAllPosts() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPostsApi();
      setPosts(data.posts || []);
    } catch (err) {
      setError("Couldn't load the feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  function handlePostCreated(newPost) {
    setPosts((prev) => [newPost, ...prev]);
  }

  return (
    <div className="mx-auto w-full max-w-[600px] px-4 py-2 ">
      {/* Header */}
      <header className="my-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full mb-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] px-5 py-4 text-left transition-colors duration-200 hover:border-[var(--color-accent)]"
        >
          <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-[var(--color-accent)] fill-none stroke-[2]">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span
            className="text-[var(--color-text-secondary)]"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            What's on your mind today?
          </span>
        </button>
      </header>
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Feed */}
      <div className="flex flex-col gap-6">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}

        {!isLoading && error && (
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button onClick={getAllPosts} className="btn-primary text-sm">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] px-8 py-12 flex flex-col items-center text-center gap-5">
            <p
              className="text-lg text-[var(--color-text-secondary)] max-w-[280px]"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              Nothing here yet. Be the first to share something.
            </p>
          </div>
        )}

        {!isLoading && !error &&
          posts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              onDeleted={(deletedId) =>
                setPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId))
              }
              onUpdated={(updatedPost) =>
                setPosts((prev) =>
                  prev.map((p) => ((p._id || p.id) === (updatedPost._id || updatedPost.id) ? updatedPost : p))
                )
              }
              onShared={(newPost) => setPosts((prev) => [newPost, ...prev])}
            />
          ))}
      </div>
    </div>
  );
}