import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto text-center" role="main">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Image Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The image you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          aria-label="Return to gallery"
        >
          ← Return to gallery
        </Link>
      </main>
    </div>
  );
}