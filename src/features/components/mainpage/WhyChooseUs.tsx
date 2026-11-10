interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'quality',
    title: 'Quality Products',
    description: 'Carefully selected products engineered with premium materials for lasting performance.',
    icon: ({ className = 'w-6 h-6' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>
    ),
  },
  {
    id: 'delivery',
    title: 'Reliable Delivery',
    description: 'Convenient and dependable shipping routes right to your doorstep.',
    icon: ({ className = 'w-6 h-6' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.25 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9.75 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM3.75 6H7.5m3 0h9.75m-15.75 6H7.5m3 0h6m-12.75 6H6.375c-.621 0-1.125-.504-1.125-1.125V5.25c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125v4.5"
        />
      </svg>
    ),
  },
  {
    id: 'payments',
    title: 'Secure Payments',
    description: 'Safe and encrypted checkout experience supporting all trusted payment options.',
    icon: ({ className = 'w-6 h-6' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    id: 'support',
    title: 'Customer Support',
    description: 'Dedicated assistance whenever you need help with orders, returns, or inquiries.',
    icon: ({ className = 'w-6 h-6' }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  return (
    <section className="w-full bg-brav-surface py-16 lg:py-24 border-b border-brav-border">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-sans font-semibold tracking-wider text-brav-gold uppercase">
            The Brav Standard
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-brav-charcoal tracking-tight">
            Why Choose Brav?
          </h2>
          <p className="font-sans font-normal text-brav-muted text-sm sm:text-base leading-relaxed">
            We prioritize exceptional quality, seamless logistics, and uncompromising security in every single transaction.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-brav-white p-8 rounded-2xl border border-brav-border shadow-sm hover:border-brav-gold/40 hover:shadow-md transition-all duration-300 flex flex-col items-start space-y-4"
            >
              {/* Icon Container */}
              <div className="p-3 bg-brav-surface text-brav-gold rounded-xl border border-brav-border">
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Title: DM Sans 600 */}
              <h3 className="font-sans font-semibold text-lg text-brav-charcoal tracking-tight">
                {feature.title}
              </h3>

              {/* Description: DM Sans 400 */}
              <p className="font-sans font-normal text-xs sm:text-sm text-brav-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}