import React, { useState } from "react";
import sharePostApi from "../../Api/Posts/CrudOperations/sharePost";
import PostBody from "./PostBody";

export default function ShareModal({ post, onClose, onShared }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { name, photo, username } = post?.user || {};

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await sharePostApi(body, post.id || post._id);

      if (res?.message && !res?._id && !res?.id) {
        throw new Error(res.message);
      }

      onShared?.(res);
      onClose();
    } catch (err) {
      console.error("Error sharing post:", err);
      setError("Couldn't share the post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[var(--radius-card)] bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-section">Share Post</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Say something about this... (optional)"
          rows={2}
          className="w-full resize-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-page)] p-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200"
        />

        {/* Preview للبوست الأصلي */}
        <div className="mt-3 rounded-[var(--radius-card)] border border-[var(--color-border)] overflow-hidden">
          <div className="p-3 flex gap-3">
            <img
              src={photo}
              alt={name}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {name}
              </p>
              {username && (
                <p className="text-xs text-[var(--color-text-secondary)] truncate">@{username}</p>
              )}
            </div>
          </div>
          <PostBody body={post?.body} image={post?.image} />
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="flex items-center justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {submitting ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}