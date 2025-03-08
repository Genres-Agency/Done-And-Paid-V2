export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative flex flex-col gap-2 items-center">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}
