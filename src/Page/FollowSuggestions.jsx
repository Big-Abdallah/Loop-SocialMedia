import { useEffect, useState } from "react";
import { Avatar } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import getFollowSuggestions from "../Api/Users/GetFollowSuggestions";
import toggleFollow from "../Api/Users/toggleFollow";


function SuggestionRow({ user, onToggle }) {
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    const prevState = following;
    setFollowing(!prevState);

    try {
      const res = await toggleFollow(user._id);
      if (typeof res?.following === "boolean") {
        setFollowing(res.following);
      }
      onToggle?.(user._id, !prevState);
    } catch (err) {
      console.error("Follow toggle error:", err);
      setFollowing(prevState); // رجّع الحالة القديمة لو فشل
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-card odd:bg-[var(--color-bg-page)] even:bg-[var(--color-bg-card)] transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <img className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full object-cover" src={user.photo} alt="" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
          {user.username && (
            <p className="text-xs text-text-secondary truncate">@{user.username}</p>
          )}
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={busy}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 shrink-0 ${
          following
            ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
            : "bg-[var(--color-text-primary)] text-[var(--color-button-text)]"
        } ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <FontAwesomeIcon icon={following ? faCheck : faUserPlus} size="xs" />
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchSuggestions() {
    setLoading(true);
    setError(false);
    try {
      const res = await getFollowSuggestions();
      setSuggestions(res?.data?.suggestions || res?.data || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSuggestions();
  }, []);

  function handleToggle(userId, isFollowing) {
    // شيل المستخدم من القايمة بعد ما يتعمله follow (اختياري)
    if (isFollowing) {
      setSuggestions((prev) => prev.filter((u) => u._id !== userId));
    }
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-4 md:mx-auto py-6 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-4 md:mx-auto py-10 text-center">
        <p className="text-text-secondary mb-3">Couldn't load suggestions.</p>
        <button className="btn-primary" onClick={fetchSuggestions}>
          Retry
        </button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="max-w-xl mx-4 md:mx-auto py-10 text-center">
        <p className="text-text-secondary">No suggestions right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-4 md:mx-auto py-6">
      <h1 className="text-section mb-4">Follow Suggestions</h1>
      <div className="flex flex-col gap-1">
        {suggestions.map((user) => (
          <SuggestionRow key={user._id} user={user} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}