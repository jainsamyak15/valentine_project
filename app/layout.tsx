import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Star } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Valentine Project',
  description: 'Valentine Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo_6_0 (2).png" />
      </head>
      <body className={inter.className}>
        <div className="fixed top-0 right-0 m-4 z-50">
          <Link 
            href="https://github.com/jainsamyak15/valentine_project" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-4 py-2 bg-white/80 backdrop-blur-lg rounded-full shadow-lg border border-pink-100 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Give it a star</span>
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}