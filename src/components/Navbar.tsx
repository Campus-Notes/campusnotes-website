import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#0057FF] to-[#00C97E] bg-clip-text text-transparent">
              CampusNotes+
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#team" className="text-sm font-medium hover:text-primary transition-colors">
              Team
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth">Login</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/auth" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
