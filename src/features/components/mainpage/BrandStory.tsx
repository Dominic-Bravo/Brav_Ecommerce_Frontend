import Link from 'next/link';
import Image from 'next/image';

interface BrandStoryProps {
  badgeText?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  buttonText?: string;
  buttonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function BrandStory({
  badgeText = "Our Heritage & Philosophy",
  title = "Crafting refined essentials for modern living.",
  paragraph1 = "Founded on the principle that everyday items should embody both functional excellence and timeless design, Brav curates a select portfolio of high-performance tech accessories and luxury lifestyle apparel.",
  paragraph2 = "Every product in our catalog undergoes rigorous evaluation for craftsmanship, durability, and aesthetic harmony—ensuring you receive items engineered to elevate your daily routine without compromise.",
  buttonText = "Read Our Full Story",
  buttonHref = "/about",
  imageUrl = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
  imageAlt = "Brav design studio and product craft",
}: BrandStoryProps) {
  return (
    <section className="w-full bg-brav-white py-16 lg:py-24 border-b border-brav-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Image Stack */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-brav-surface border border-brav-border shadow-lg">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Floating Highlight Card */}
          <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-brav-dark text-brav-white p-5 rounded-2xl border border-brav-gold/30 shadow-2xl max-w-xs hidden sm:block">
            <span className="text-xs font-sans font-semibold text-brav-gold uppercase tracking-wider block mb-1">
              The Brav Promise
            </span>
            <p className="text-xs font-sans font-normal text-brav-white/80 leading-relaxed">
              Uncompromising quality, sustainable sourcing, and deliberate minimalism in every piece.
            </p>
          </div>
        </div>

        {/* Right Column: Text & Stats */}
        <div className="lg:col-span-6 space-y-6">
          {/* Badge */}
          {badgeText && (
            <span className="inline-block px-3.5 py-1 text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase bg-brav-surface border border-brav-border rounded-full">
              {badgeText}
            </span>
          )}

          {/* Section Heading: Playfair Display 500-600 */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-brav-charcoal tracking-tight leading-[1.15]">
            {title}
          </h2>

          {/* Paragraphs: DM Sans 400 */}
          <div className="space-y-4 font-sans font-normal text-brav-muted text-sm sm:text-base leading-relaxed">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
          </div>

          {/* Stats Summary Row */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-brav-border">
            <div>
              <span className="font-display text-2xl sm:text-3xl font-medium text-brav-charcoal block">
                100%
              </span>
              <span className="font-sans text-xs text-brav-muted font-medium">
                Curated Quality
              </span>
            </div>
            <div>
              <span className="font-display text-2xl sm:text-3xl font-medium text-brav-charcoal block">
                24/7
              </span>
              <span className="font-sans text-xs text-brav-muted font-medium">
                Global Support
              </span>
            </div>
            <div>
              <span className="font-display text-2xl sm:text-3xl font-medium text-brav-charcoal block">
                4.9★
              </span>
              <span className="font-sans text-xs text-brav-muted font-medium">
                Customer Score
              </span>
            </div>
          </div>

          {/* Action Button: DM Sans 600 */}
          <div className="pt-2">
            <Link
              href={buttonHref}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-sans font-semibold text-brav-charcoal bg-brav-surface hover:bg-brav-border/60 border border-brav-border rounded-xl transition-colors"
            >
              <span>{buttonText}</span>
              <svg
                className="w-4 h-4 text-brav-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}