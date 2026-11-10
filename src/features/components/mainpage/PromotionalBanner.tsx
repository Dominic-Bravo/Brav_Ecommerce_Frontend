import Link from 'next/link';
import Image from 'next/image';

interface PromotionalBannerProps {
  badgeText?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  promoCode?: string;
}

export function PromotionalBanner({
  badgeText = "Limited Time Offer",
  title = "Enjoy 20% off your first luxury apparel purchase",
  description = "Crafted with premium sustainable materials designed to last a lifetime. Upgrade your wardrobe with timeless essentials today.",
  buttonText = "Claim Discount",
  buttonHref = "/shop",
  imageUrl = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop",
  imageAlt = "Brav seasonal luxury apparel promotion banner",
  promoCode = "WELCOME20",
}: PromotionalBannerProps) {
  return (
    <section className="w-full bg-brav-white py-12 lg:py-16 border-b border-brav-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brav-dark text-brav-white border border-brav-dark shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
          
          {/* Background Decorative Pattern */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brav-gold/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              {badgeText && (
                <span className="px-3.5 py-1 text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase bg-brav-charcoal border border-brav-gold/30 rounded-full">
                  {badgeText}
                </span>
              )}
              {promoCode && (
                <span className="text-xs font-sans font-medium text-brav-white/80">
                  Code: <code className="text-brav-gold font-semibold tracking-wider">{promoCode}</code>
                </span>
              )}
            </div>

            {/* Title: Playfair Display 500-600 */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-brav-white leading-[1.15]">
              {title}
            </h2>

            {/* Description: DM Sans 400 */}
            <p className="font-sans font-normal text-brav-white/75 text-base sm:text-lg max-w-xl leading-relaxed">
              {description}
            </p>

            {/* CTA Button: DM Sans 600 */}
            <div className="pt-2">
              <Link
                href={buttonHref}
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-sans font-semibold text-brav-dark bg-brav-gold hover:bg-brav-gold/90 rounded-xl transition-all shadow-lg shadow-brav-gold/20"
              >
                {buttonText}
              </Link>
            </div>
          </div>

          {/* Right Column: Promotional Image */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brav-white/10 shadow-xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brav-dark/40 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}