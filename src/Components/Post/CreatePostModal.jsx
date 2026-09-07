import React, { useState } from "react";
import createPostApi from "../../Api/Posts/CrudOperations/createPost";
import updatePostApi from "../../Api/Posts/CrudOperations/updatePost";

export default function CreatePostModal({ onClose, onPostCreated, onPostUpdated, existingPost = null }) {
  const isEditMode = !!existingPost;

  const [body, setBody] = useState(existingPost?.body || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(existingPost?.image || null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit() {
    if (!body.trim() && !imageFile && !imagePreview) return;
    setSubmitting(true);
    setError(null);

    try {
      let res;
      if (isEditMode) {
        res = await updatePostApi(body, imageFile, existingPost.id || existingPost._id);
      } else {
        res = await createPostApi(body, imageFile);
      }

      if (res?.message && !res?._id && !res?.id) {
        throw new Error(res.message);
      }

      if (isEditMode) {
        onPostUpdated?.(res);
      } else {
        onPostCreated?.(res);
      }
      onClose();
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} post:`, err);
      setError(`Couldn't ${isEditMode ? "update" : "create"} the post. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-[var(--radius-card)] bg-[var(--color-bg-card)] border border-[var(--color-border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-section">{isEditMode ? "Edit Post" : "Create Post"}</h2>
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
          placeholder="What's on your mind today?"
          rows={4}
          className="w-full resize-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-page)] p-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors duration-200"
        />

        {imagePreview && (
          <div className="relative mt-3">
            <img
              src={imagePreview}
              alt="preview"
              className="w-full max-h-72 object-cover rounded-[var(--radius-card)]"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white text-sm flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="flex items-center justify-between mt-4">
          <label className="cursor-pointer text-sm font-medium text-[var(--color-accent)]">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            + Add Photo
          </label>

          <button
            onClick={handleSubmit}
            disabled={submitting || (!body.trim() && !imageFile && !imagePreview)}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {submitting ? (isEditMode ? "Saving..." : "Posting...") : (isEditMode ? "Save" : "Post")}
          </button>
        </div>
      </div>
    </div>
  );
}