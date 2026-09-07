import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUserGroup,
  faLock,
  faHeart as faHeartS,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "@heroui/react";
import {timeAgo} from "../../Utils/utils.js" 
import { useNavigate } from "react-router-dom";
function Avatar({ user, size = 40 }) {
  const name = user?.name || "Unknown";
  const navigate = useNavigate();
  return user?.photo ? (
    <img
      onClick={() => navigate(`/userProfile/${user?._id}`)}
      src={user.photo}
      alt={name}
      style={{ width: size, height: size }}
      className="cursor-pointer rounded-full object-cover border border-[var(--color-border)]"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center text-sm font-semibold"
    >
      {getInitials(name)}
    </div>
  );
}

export function PrivacyBadge({ privacy }) {
  const icons = {
    public: <FontAwesomeIcon icon={faGlobe} className="h-3 w-3" />,
    friends: <FontAwesomeIcon icon={faUserGroup} className="h-3 w-3" />,
    private: <FontAwesomeIcon icon={faLock} className="h-3 w-3" />,
  };
  return (
    <span className="inline-flex items-center gap-1 text-[var(--color-text-secondary)]">
      {icons[privacy] || icons.public}
    </span>
  );
}
function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}


export default function CardHeader({ user, name, createdAt, privacy }) {
  return (
    <>
    <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <Avatar  user={user} size={40} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {name}
            </p>
            <p className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
              @{user?.username} · {timeAgo(createdAt)} ·{" "}
              <PrivacyBadge privacy={privacy} />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
