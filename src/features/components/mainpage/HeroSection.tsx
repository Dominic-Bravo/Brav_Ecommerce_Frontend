import Link from 'next/link';

interface HeroSectionProps {
  badgeText?: string;
  headline?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function HeroSection({
  badgeText = "New Season Collection 2026",
  headline = "Elevate your lifestyle with refined craft & modern engineering.",
  description = "Discover a curated catalog of high-performance tech accessories and luxury lifestyle apparel—crafted for seamless everyday living.",
  primaryBtnText = "Shop Now",
  primaryBtnHref = "/products",
  secondaryBtnText = "Explore Collection",
  secondaryBtnHref = "/category",
  imageUrl = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
  imageAlt = "Brav editorial lifestyle collection preview",
}: HeroSectionProps) {
  return (
    <section className="relative w-full bg-brav-white overflow-hidden py-12 lg:py-20 border-b border-brav-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Tag / Badge */}
          {badgeText && (
            <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider text-brav-gold uppercase bg-brav-surface border border-brav-border rounded-full">
              {badgeText}
            </span>
          )}

          {/* Hero Headline: Playfair Display 500-600 */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-brav-charcoal tracking-tight leading-[1.12]">
            {headline}
          </h1>

          {/* Product Description: DM Sans 400 */}
          <p className="font-sans font-normal text-brav-muted text-base sm:text-lg max-w-xl leading-relaxed">
            {description}
          </p>

          {/* Action Buttons: DM Sans 600 */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={primaryBtnHref}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-sans font-semibold text-brav-white bg-brav-charcoal hover:bg-brav-dark rounded-xl transition-colors shadow-md shadow-brav-charcoal/10"
            >
              {primaryBtnText}
            </Link>
            
            <Link
              href={secondaryBtnHref}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-sans font-semibold text-brav-charcoal bg-brav-surface hover:bg-brav-border/60 border border-brav-border rounded-xl transition-colors"
            >
              {secondaryBtnText}
            </Link>
          </div>
        </div>

        {/* Right Column: Editorial Lifestyle Image */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brav-surface border border-brav-border shadow-xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle editorial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brav-dark/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}