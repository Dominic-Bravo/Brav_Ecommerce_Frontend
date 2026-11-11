"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Gem, Compass, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brav-white font-sans text-brav-charcoal selection:bg-brav-gold/20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-brav-border bg-brav-surface/40 py-20 lg:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brav-gold">
            Our Heritage & Vision
          </span>
          
          <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-brav-charcoal leading-[1.15]">
            Crafted for Those Who Demand <br className="hidden sm:inline" /> Uncompromised Elegance
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-brav-muted font-sans leading-relaxed">
            At Brav, we believe true luxury lives at the intersection of timeless minimalism and rigorous precision engineering. Every piece in our catalog is curated to make a singular statement.
          </p>
        </div>
      </section>

      {/* 2. Core Narrative / Brand Story */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Brand Image Wrapper */}
          <div className="relative aspect-4/5 w-full rounded-2xl bg-brav-surface border border-brav-border overflow-hidden shadow-xs">
            <Image
              src="https://images.pexels.com/photos/33524465/pexels-photo-33524465.jpeg"
              alt="Brav luxury showcase"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority
            />
          </div>

          {/* Narrative Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-brav-gold">
                The Origin
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
                Refining the Essentials
              </h2>
            </div>

            <p className="text-sm text-brav-muted leading-relaxed">
              Founded on the principle that modern luxury should be clean, intentional, and enduring, Brav emerged as a answer to fast fashion and disposable craftsmanship.
            </p>

            <p className="text-sm text-brav-muted leading-relaxed">
              We partner directly with master artisans and premier workshops to ensure every silhouette, stitch, and finish adheres to uncompromising structural and aesthetic standards.
            </p>

            <div className="pt-2">
              <div className="p-4 bg-brav-surface/60 rounded-xl border border-brav-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brav-white border border-brav-border flex items-center justify-center shrink-0">
                  <Gem className="w-5 h-5 text-brav-gold" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-brav-charcoal">
                    Uncompromising Quality
                  </h4>
                  <p className="text-xs text-brav-muted">
                    Every item is individually inspected before catalog entry.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Pillars / Values */}
      <section className="border-y border-brav-border bg-brav-surface/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brav-gold">
              Our Principles
            </span>
            <h2 className="font-display text-3xl font-medium text-brav-charcoal tracking-tight">
              Built Upon Three Core Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-brav-white p-8 rounded-2xl border border-brav-border shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brav-surface border border-brav-border flex items-center justify-center text-brav-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-medium text-brav-charcoal">
                Authentic Craft
              </h3>
              <p className="text-xs sm:text-sm text-brav-muted leading-relaxed">
                We eliminate middleman markups to invest directly in premium raw materials and high-precision production processes.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-brav-white p-8 rounded-2xl border border-brav-border shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brav-surface border border-brav-border flex items-center justify-center text-brav-gold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-medium text-brav-charcoal">
                Timeless Design
              </h3>
              <p className="text-xs sm:text-sm text-brav-muted leading-relaxed">
                Our design language ignores fleeting seasonal trends in favor of architectural proportion, structural longevity, and clean lines.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-brav-white p-8 rounded-2xl border border-brav-border shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brav-surface border border-brav-border flex items-center justify-center text-brav-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-medium text-brav-charcoal">
                Seamless Experience
              </h3>
              <p className="text-xs sm:text-sm text-brav-muted leading-relaxed">
                From initial catalog browsing to final unboxing, every digital and physical interaction is built to provide maximum refinement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Call To Action Footer */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
          Explore the Brav Collection
        </h2>
        <p className="text-xs sm:text-sm text-brav-muted max-w-md mx-auto">
          Discover our full selection of luxury catalog offerings curated for discerning tastes worldwide.
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brav-charcoal hover:bg-brav-dark text-brav-white font-sans text-xs font-semibold rounded-xl shadow-md transition-all duration-200 active:scale-95"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4 text-brav-gold" />
          </Link>
        </div>
      </section>

    </main>
  );
}