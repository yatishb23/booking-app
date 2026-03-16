import { ReactNode } from 'react';
import Link from 'next/link';
import { Ticket } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg transform group-hover:scale-105 transition-transform">
          <Ticket className="w-6 h-6 -rotate-12" />
        </div>
        <span className="font-bold text-2xl tracking-tight">EventHub</span>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
