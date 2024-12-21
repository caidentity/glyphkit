import Link from 'next/link';
import Container from '@/components/layout/Container';

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <Container>
        <h1 className="text-4xl font-bold mb-8">Welcome to Glphykit</h1>
        
        <nav className="grid gap-4">
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
        </nav>
      </Container>
    </main>
  );
}
