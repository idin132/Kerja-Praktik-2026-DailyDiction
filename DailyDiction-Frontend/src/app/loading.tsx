export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFD700] border-t-transparent"></div>
        <p className="text-xs font-mono text-text-muted animate-pulse">
          LOADING CONTENT...
        </p>
      </div>
    </div>
  );
}