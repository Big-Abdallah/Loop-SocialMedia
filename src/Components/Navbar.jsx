import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, User, Bell, BellRing, Settings, LogOut, Menu, Users, UserPlus ,Rss ,Newspaper ,LayoutList} from "lucide-react";
import { AuthContext } from "../Contexts/AuthContext";
import { getProfileContext } from "../Contexts/getProfileContext";
import favicon from "../asset/favicon-48.png";

export default function Navbar() {
  const { photo, name, unreadCount } = useContext(getProfileContext);
  const { setIsLoggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedin(false);
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/90 backdrop-blur">
      <div className="mx-auto flex h-13 max-w-6xl items-center gap-3 px-3 sm:h-16 sm:gap-6 sm:px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0 sm:gap-2.5">
          <img src={favicon} alt="Loop" className="h-6 w-6 sm:h-8 sm:w-8" />
          <span className="text-[1.1rem] font-semibold tracking-tight text-[var(--color-text-primary)] xs:block">
            Loop
          </span>
        </NavLink>

        {/* Center nav pills — desktop only */}
        <nav className="mx-auto me-22 hidden items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-page)] p-1.5 md:flex">
          <NavPill to="/" icon={<Home size={17} strokeWidth={1.8} />} label="For You" end />
          <NavPill to="/following-feed" icon={<LayoutList size={17} strokeWidth={1.8} />} label="Following" />
          <NavPill to="/suggestions" icon={<UserPlus size={17} strokeWidth={1.8} />} label="Suggestions" />
          <NavPill
            to="/notifications"
            icon={<NotificationBell count={unreadCount} size={17} />}
            label="Notifications"
          /> 
        </nav>

        {/* Mobile nav icons — inline, no extra row */}
        <nav className="ml-auto flex items-center gap-0.5 md:hidden">
          <MobileIcon to="/" icon={<Home size={18} strokeWidth={1.8} />} end />
          <MobileIcon to="/following-feed" icon={<LayoutList size={18} strokeWidth={1.8} />} />
          <MobileIcon to="/suggestions" icon={<UserPlus size={18} strokeWidth={1.8} />} />
          <MobileIcon
            to="/notifications"
            icon={<NotificationBell count={unreadCount} size={18} />}
          />
        </nav>

        {/* User menu */}
        <div className="relative md:ml-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] py-0.5 pl-0.5 pr-1.5 transition-colors duration-200 hover:bg-[var(--color-bg-page)] sm:gap-2.5 sm:py-1 sm:pl-1 sm:pr-3"
          >
            <img
              src={photo ? photo : "https://i.pravatar.cc/72?img=12"}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-9 sm:w-9"
            />
            <span className="hidden text-sm font-medium text-[var(--color-text-primary)] sm:block">
              {name}
            </span>
            <Menu size={14} strokeWidth={1.8} className="hidden text-[var(--color-text-secondary)] sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-44 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 shadow-sm sm:top-12 sm:w-48">
              <MenuLink to="/profile" icon={<User size={16} strokeWidth={1.8} />} onClick={() => setMenuOpen(false)}>
                Profile
              </MenuLink>
              <MenuLink to="/settings" icon={<Settings size={16} strokeWidth={1.8} />} onClick={() => setMenuOpen(false)}>
                Settings
              </MenuLink>
              <div className="my-1 border-t border-[var(--color-border)]" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-500 transition-colors duration-200 hover:bg-[var(--color-accent-soft)]"
              >
                <LogOut size={16} strokeWidth={1.8} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NotificationBell({ count = 0, size = 17 }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <span className="relative inline-flex items-center justify-center">
      {count > 0 ? (
        <BellRing size={size} strokeWidth={1.8} className="text-[var(--color-accent)]" />
      ) : (
        <Bell size={size} strokeWidth={1.8} />
      )}

      {count > 0 && (
        <span
          className={`absolute -top-2  -right-4 sm:-top-2 sm:-right-28 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] font-bold leading-none text-[var(--color-button-text)] ${
            pulse ? "scale-125" : "scale-100"
          } transition-transform duration-300`}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </span>
  );
}

function NavPill({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
          isActive
            ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        ].join(" ")
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function MobileIcon({ to, icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
          isActive
            ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
            : "text-[var(--color-text-secondary)]",
        ].join(" ")
      }
    >
      {icon}
    </NavLink>
  );
}

function MenuLink({ to, icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-accent-soft)]"
    >
      {icon}
      {children}
    </NavLink>
  );
}