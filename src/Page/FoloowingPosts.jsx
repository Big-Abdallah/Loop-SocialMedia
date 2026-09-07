import React, { useState, useEffect } from "react";
import getFollowingPostsApi from "../Api/Posts/getFollowingPosts";
import PostCard from "../Components/Post/PostCard";
import PostSkeleton from "../Components/Post/PostSkeleton";

export default function FollowingFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getFollowingPosts() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFollowingPostsApi();
      setPosts(data?.posts || []);
    } catch (err) {
      setError("Couldn't load your following feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFollowingPosts();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[600px] px-4 py-2">
      {/* Header */}
      <header className="my-3">
        <h2 className="mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          Following
        </h2>
      </header>

      {/* Feed */}
      <div className="flex flex-col gap-6">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}

        {!isLoading && error && (
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button onClick={getFollowingPosts} className="btn-primary text-sm">
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
              No posts yet from people you follow. Try following someone to see their posts here.
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