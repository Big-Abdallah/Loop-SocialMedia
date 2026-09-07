import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@heroui/react";
import getPostLikesApi from "../../Api/Posts/getPostLikes";

function LikeRow({ user }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/userProfile/${user._id || user.id}`)}
      className="cursor-pointer flex items-center gap-3 p-3 rounded-card odd:bg-[var(--color-bg-page)] even:bg-[var(--color-bg-card)] hover:bg-[var(--color-accent-soft)] transition-colors duration-200"
    >
      <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-full object-cover " />
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
        {user.username && (
          <p className="text-xs text-text-secondary truncate">@{user.username}</p>
        )}
      </div>
    </div>
  );
}

export default function PostLikes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchLikes() {
    setLoading(true);
    setError(false);
    try {
      const res = await getPostLikesApi(id);
      // احتياط لاختلاف شكل الـ response — عدّل حسب اللي هيطلع فعليًا
      const list = Array.isArray(res) ? res : res?.likes || [];
      setLikes(list);
    } catch (err) {
      console.error("Error fetching post likes:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLikes();
  }, [id]);

  return (
    <div className="max-w-xl mx-4 md:mx-auto py-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 my-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
        Back
      </button>

      <h1 className="text-section mb-4">Likes</h1>

      {loading && (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center">
          <p className="text-sm text-red-500 mb-4">Couldn't load likes.</p>
          <button onClick={fetchLikes} className="btn-primary text-sm">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && likes.length === 0 && (
        <p className="text-center text-text-secondary py-8">No likes yet.</p>
      )}

      {!loading && !error && likes.length > 0 && (
        <div className="flex flex-col gap-1">
          {likes.map((user) => (
            <LikeRow key={user._id || user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}