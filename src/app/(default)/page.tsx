import { Suspense } from "react";
import Wrapper from "@/components/Wrapper";
import { POPULAR_CITIES_SECTION_SEE_ALL_URL, POPULAR_CITIES_SECTION_TITLE } from "@/data/staticData";
import { Metadata } from "next";

// Regular imports for server components
import Hero from "@/components/HeroSection/Hero";
import Announcement from "@/components/home_page/Announcement";
import Categories from "@/components/CategoriesSection/Categories";
import TripPlannerBanner from "@/components/TripPlannerBanner";
import CitiesSection from "@/components/City/CitiesSection";
import DownloadBanner from "@/components/home_page/DownloadBanner";
import DealsSection from "@/components/home_page/DealsSection";
import RecommendedSection from "@/components/RecommendedSection";
import TrendingSection from "@/components/home_page/TrendingSection";
import BlogSection from "@/components/home_page/BlogSection";

export const metadata: Metadata = {
  title: "Exploreden - Plan Your Perfect Trip & Discover Amazing Destinations",
  description: "Start your next adventure with Exploreden. Discover trending destinations, find exclusive travel deals, plan personalized trips, and book unforgettable experiences. Explore the world with confidence.",
  keywords: [
    "travel planning",
    "trip planner",
    "travel destinations",
    "vacation planning",
    "travel deals",
    "trending destinations",
    "travel booking",
    "holiday planning",
    "adventure travel",
    "travel experiences",
    "destination discovery",
    "travel guide"
  ],
  openGraph: {
    title: "Exploreden - Plan Your Perfect Trip & Discover Amazing Destinations",
    description: "Start your next adventure with Exploreden. Discover trending destinations, find exclusive travel deals, and plan personalized trips.",
    url: "https://exploreden.com.au",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Exploreden Homepage - Travel Planning Made Easy",
      },
    ],
  },
  twitter: {
    title: "Exploreden - Plan Your Perfect Trip & Discover Amazing Destinations",
    description: "Start your next adventure with Exploreden. Discover trending destinations, find exclusive travel deals, and plan personalized trips.",
    images: ["/twitter-home.jpg"],
  },
  alternates: {
    canonical: "https://exploreden.com.au",
  },
};

// Loading fallback
const DefaultLoading = () => <div className="animate-pulse h-32 bg-gray-200 rounded-md"></div>;

export default async function Home() {
  return (
    <>

      <Wrapper>
        <Announcement />
        <Suspense fallback={<div className="bg-primary-100 z-40 relative h-full min-h-[620px]  lg:min-h-[510px] flex flex-col justify-center items-center animate-pulse"></div>}>
          <Hero />
        </Suspense>
        <Categories />

        <TrendingSection />
        <DealsSection />

        <Suspense fallback={<DefaultLoading />}>
          <TripPlannerBanner />
        </Suspense>

        <CitiesSection title={POPULAR_CITIES_SECTION_TITLE} seeAllUrl={POPULAR_CITIES_SECTION_SEE_ALL_URL} />

        <Suspense fallback={<DefaultLoading />}>
          <RecommendedSection />
        </Suspense>

        <Suspense fallback={<DefaultLoading />}>
          <DownloadBanner />
        </Suspense>

        <BlogSection />
      </Wrapper>
    </>
  );
}
