export default function Loading() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-2xl">
      <div className="animate-pulse bg-white/10 rounded-lg p-8">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
} 