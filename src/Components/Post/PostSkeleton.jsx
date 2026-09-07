
function PostSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-7 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[var(--color-border)]" />
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-24 rounded bg-[var(--color-border)]" />
          <div className="h-2 w-14 rounded bg-[var(--color-border)]" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-[var(--color-border)]" />
      <div className="h-3 w-3/4 rounded bg-[var(--color-border)]" />
    </div>
  );
}
export default PostSkeleton;