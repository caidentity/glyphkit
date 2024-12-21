import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to Glphykit</h1>

        <div className="grid gap-4">
          <Link
            href="/about"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            About Us
          </Link>

          <Link
            href="/posts"
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Blog Posts
          </Link>
        </div>
      </div>
    </main>
  );
}
