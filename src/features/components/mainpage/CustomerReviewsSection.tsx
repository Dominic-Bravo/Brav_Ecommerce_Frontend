import type { Review } from "@/api/generated/models/reviews/review"; // Adjust path to your generated Orval types

interface CustomerReviewsSectionProps {
  reviews?: Review[];
  isLoading?: boolean;
}

// Sample mock data conforming strictly to your Orval `Review` interface
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    user: 'usr-101',
    user_email: 'alex.m@example.com',
    user_name: 'Alexander Wright',
    product: 'prod-01',
    rating: 5,
    comment:
      'The build quality of the ANC headphones exceeded my expectations. Sleek design, superb acoustic clarity, and fast shipping!',
    is_verified_purchase: true,
    created_at: '2026-10-14T10:30:00Z',
    updated_at: '2026-10-14T10:30:00Z',
  },
  {
    id: 'rev-02',
    user: 'usr-102',
    user_email: 'sophia.c@example.com',
    user_name: 'Sophia Chen',
    product: 'prod-02',
    rating: 5,
    comment:
      'The French terry hoodie feels heavy and premium. Truly minimal branding and fits true to size. Will definitely order again.',
    is_verified_purchase: true,
    created_at: '2026-10-28T14:15:00Z',
    updated_at: '2026-10-28T14:15:00Z',
  },
  {
    id: 'rev-03',
    user: 'usr-103',
    user_email: 'marcus.v@example.com',
    user_name: 'Marcus Vance',
    product: 'prod-03',
    rating: 4,
    comment:
      'Leather quality on the cardholder is top notch. Smells great and fits comfortably in front pockets without bulge.',
    is_verified_purchase: false,
    created_at: '2026-11-02T09:45:00Z',
    updated_at: '2026-11-02T09:45:00Z',
  },
];

export function CustomerReviewsSection({
  reviews = MOCK_REVIEWS,
  isLoading = false,
}: CustomerReviewsSectionProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="w-full bg-brav-surface py-16 lg:py-24 border-b border-brav-border">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-brav-border gap-4">
          <div className="space-y-1">
            <span className="text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase">
              Community Feedback
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex text-brav-gold">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-sans font-semibold text-brav-charcoal">
              4.9 / 5.0 Average Score
            </span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-brav-border/40 animate-pulse border border-brav-border"
              />
            ))}
          </div>
        ) : (
          /* Reviews Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-brav-white p-6 sm:p-8 rounded-2xl border border-brav-border shadow-sm flex flex-col justify-between space-y-6 hover:border-brav-gold/40 hover:shadow-md transition-all duration-300"
              >
                {/* Rating & Verified Tag */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Star Rating */}
                    <div className="flex text-brav-gold">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-current' : 'text-brav-border fill-current'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Verified Purchase Badge */}
                    {review.is_verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Comment Body: DM Sans 400 */}
                  <p className="font-sans font-normal text-sm text-brav-charcoal leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-brav-border/60 flex items-center justify-between">
                  <div>
                    {/* User Name: DM Sans 600 */}
                    <h4 className="font-sans font-semibold text-sm text-brav-charcoal">
                      {review.user_name}
                    </h4>
                    <span className="font-sans text-[11px] text-brav-muted font-normal block">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  {/* Initial Avatar */}
                  <div className="w-8 h-8 rounded-full bg-brav-surface border border-brav-border text-brav-gold font-sans font-semibold text-xs flex items-center justify-center">
                    {review.user_name.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}