export default function Footer() {
  const columns = [
    {
      title: "Product",
      links: ["Home", "Explore", "Messages", "Notifications"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press"],
    },
    {
      title: "Resources",
      links: ["Help center", "Community guidelines", "Developers"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookies"],
    },
  ];

  return (
   <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-page)]">
  <div className="mx-auto max-w-6xl px-6 py-8">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="text-lg font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Loop
        </span>
        <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-[var(--color-text-secondary)]">
          A quieter place to share what you're working on.
        </p>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)]">
        © {new Date().getFullYear()} Loop. All rights reserved.
      </p>
    </div>
  </div>

  <div className="border-t border-[var(--color-border)] px-6 py-4">
    <p className="mx-auto max-w-6xl text-sm text-[var(--color-text-secondary)]">
      Made with ❤️ by{" "}
      <a
        href="https://eng-abdallah-ten.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-text-primary)] hover:underline"
      >
        SWE Abdallah
      </a>
    </p>
  </div>
</footer>
  );
}