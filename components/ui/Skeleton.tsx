export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[var(--bg-elevated)] ${className}`}
      aria-hidden="true"
    />
  );
}
