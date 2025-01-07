export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-[400px] bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded w-2/3"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 