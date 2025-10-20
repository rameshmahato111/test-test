import type { Metadata } from "next";

import Footer from "@/components/FooterSections/Footer";
import { SearchDetailProvider } from '@/contexts/SearchDetailContext';
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Home",
  description: "Exploreden is a travel planning app that helps you plan your next trip. It's a one-stop-shop for all your travel needs. ",
};

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader color="#FF4083" />
      <SearchDetailProvider>
        {children}
      </SearchDetailProvider>
      <Footer />
    </>
  );
}
