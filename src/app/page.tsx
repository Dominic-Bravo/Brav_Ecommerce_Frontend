"use client";

import { AnnouncementBar } from "@/features/components/mainpage/AnnouncementBar";
import { BrandStory } from "@/features/components/mainpage/BrandStory";
import { CategorySection } from "@/features/components/mainpage/CategorySection";
import { CustomerReviewsSection } from "@/features/components/mainpage/CustomerReviewsSection";
import { FeaturedProductsSection } from "@/features/components/mainpage/FeaturedProductsSection";
import { HeroSection } from "@/features/components/mainpage/HeroSection";
import { PromotionalBanner } from "@/features/components/mainpage/PromotionalBanner";
import { WhyChooseUs } from "@/features/components/mainpage/WhyChooseUs";

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <HeroSection/>
      <CategorySection/>
      <FeaturedProductsSection/>
      <PromotionalBanner/>
      <WhyChooseUs/>
      <BrandStory/>
      <CustomerReviewsSection/>
    </>
  );
}
