import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import getSinglePostApi from "../Api/Posts/getSinglePost";
import PostCard from "../Components/Post/PostCard";
import CommentsSection from "../Components/Comment/CommentsSection";

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const postDetails = await getSinglePostApi(id);
        setPost(postDetails.post);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Something went wrong while loading the post.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const BackButton = () => (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 mb-4"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
      Back
    </button>
  );

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4">
        <BackButton />
        <p className="text-center text-[var(--color-text-secondary)]">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4">
        <BackButton />
        <p className="text-center text-[var(--color-text-danger)]">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4">
        <BackButton />
        <p className="text-center text-[var(--color-text-secondary)]">
          Post not found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6 px-4 pb-10">
      <BackButton />

      <article className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
        <PostCard post={post} />
        <CommentsSection
          postId={post._id || post.id}
          topComment={post.topComment}
          commentsCount={post.commentsCount}
        />
      </article>
    </div>
  );
}