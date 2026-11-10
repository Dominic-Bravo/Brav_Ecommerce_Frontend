import Link from 'next/link';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="font-sans font-normal text-xs text-brav-muted hover:text-brav-gold transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brav-dark text-brav-white border-t border-brav-dark/20 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brav-white/10">
          
          {/* Column 1: Brand Info & Short Description */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link
              href="/"
              className="font-display text-3xl font-semibold tracking-tight text-brav-white hover:text-brav-gold transition-colors inline-block"
            >
              Brav
            </Link>
            <p className="font-sans font-normal text-xs text-brav-white/70 max-w-sm leading-relaxed">
              Elevating daily living through a curated collection of high-performance tech accessories and luxury apparel. Engineered with precision and timeless craft.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-brav-charcoal border border-brav-white/10 text-brav-white/80 hover:text-brav-gold hover:border-brav-gold/50 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-brav-charcoal border border-brav-white/10 text-brav-white/80 hover:text-brav-gold hover:border-brav-gold/50 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-brav-charcoal border border-brav-white/10 text-brav-white/80 hover:text-brav-gold hover:border-brav-gold/50 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.842-2.971 2.64v1.335h4.281l-.568 3.667h-3.713v7.98z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-xs text-brav-gold uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href="/shop">All Products</FooterLink>
              <FooterLink href="/categories/clothes">Clothes</FooterLink>
              <FooterLink href="/categories/accessories">Accessories</FooterLink>
              <FooterLink href="/categories/technology">Technology</FooterLink>
              <FooterLink href="/shop?filter=new">New Arrivals</FooterLink>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-xs text-brav-gold uppercase tracking-wider">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/faqs">FAQs</FooterLink>
              <FooterLink href="/shipping">Shipping Information</FooterLink>
              <FooterLink href="/returns">Returns & Exchanges</FooterLink>
              <FooterLink href="/order-status">Track Order</FooterLink>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div className="space-y-3">
            <h4 className="font-sans font-semibold text-xs text-brav-gold uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-2.5">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/refund-policy">Refund Policy</FooterLink>
              <FooterLink href="/cookie-policy">Cookie Preferences</FooterLink>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-brav-white/50">
          <p>© {currentYear} Brav Inc. All rights reserved.</p>
          <p className="text-[11px]">Designed with Next.js, TypeScript & Tailwind CSS v4.</p>
        </div>
      </div>
    </footer>
  );
}