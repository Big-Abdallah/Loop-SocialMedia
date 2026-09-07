import { Compass } from "lucide-react";
import { NavLink } from "react-router-dom";
import img from "../asset/notfound.png";

export default function NotFound() {
  return (
    <main className="flex  flex-col items-center justify-center text-center">
      
      {/* Illustration */}
      <img
        src={img}
        alt="Page Not Found"
        className=" w-full max-w-[420px] object-contain"
      />

      {/* Content */}
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
        Page not found
      </span>

      <h1 className="mt-2 text-7xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-8xl">
        404
      </h1>

      <p className="mt-4 max-w-[42ch] text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base">
        The page you're looking for was moved, deleted, or never existed.
        Let's get you back to your feed.
      </p>

      {/* Action */}
      <div className="m-8">
        <NavLink
          to="/"
          replace
          className="btn-primary inline-flex items-center gap-2"
        >
          <Compass size={17} strokeWidth={1.5} />
          Back to home
        </NavLink>
      </div>
    </main>
  );
}