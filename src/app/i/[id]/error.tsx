'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Go back home
          </Link>
        </div>
      </main>
    </div>
  )
} 