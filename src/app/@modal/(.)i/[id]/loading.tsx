export default function Loading() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-2xl">
      <div className="relative w-full max-w-7xl aspect-[3/2] animate-pulse bg-gray-800/50 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent shimmer" />
      </div>
    </div>
  );
} 