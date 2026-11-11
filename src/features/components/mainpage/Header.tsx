import Link from 'next/link';
import { ProfileButton } from '../profile/ProfileButton';
import { CartButton } from '../carts/CartButton';

// --- Sub-components for clean separation of concerns ---

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="font-sans text-sm font-medium text-brav-charcoal/80 hover:text-brav-gold transition-colors"
    >
      {children}
    </Link>
  );
}

function SearchBar() {
  return (
    <div className="relative w-full max-w-xs hidden sm:block">
      <input
        type="search"
        placeholder="Search products..."
        className="w-full bg-brav-surface border border-brav-border rounded-full py-1.5 pl-9 pr-4 text-xs font-sans text-brav-charcoal placeholder:text-brav-muted focus:outline-none focus:border-brav-gold transition-colors"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brav-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </div>
  );
}

// --- Main Header Export ---

export function Header() {
  return (
    <header className="w-full border-b border-brav-border bg-brav-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-brav-charcoal hover:text-brav-gold transition-colors shrink-0"
        >
          Brav
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Shop</NavLink>
          <NavLink href="/category">Categories</NavLink>
          <NavLink href="/about">About Us</NavLink>
        </nav>

        {/* Right Action Cluster (Search, Cart, Profile) */}
        <div className="flex items-center gap-3">
          <CartButton count={0} />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}