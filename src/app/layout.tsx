import "./globals.css";
import { Poppins, Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import Script from "next/script";
import Providers from "@/components/QueryProvider";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import BackToTop from "@/components/BackToTop";
import NavBar from "@/components/NavigationBar/NavBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://exploreden.com.au"),
  title: {
    default: "Exploreden - Your Ultimate Travel Planning Companion",
    template: "%s | Exploreden",
  },
  description:
    "Discover your next adventure with Exploreden. Plan your perfect trip, explore destinations, book experiences, and create unforgettable memories. Your one-stop-shop for all travel needs.",
  keywords: [
    "travel planning",
    "trip planner",
    "travel destinations",
    "vacation planning",
    "travel booking",
    "explore destinations",
    "travel experiences",
    "holiday planning",
    "travel guide",
    "adventure travel",
    "travel app",
    "tourism",
  ],
  authors: [{ name: "Exploreden Team" }],
  creator: "Exploreden",
  publisher: "Exploreden",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://exploreden.com.au",
    siteName: "Exploreden",
    title: "Exploreden - Your Ultimate Travel Planning Companion",
    description:
      "Discover your next adventure with Exploreden. Plan your perfect trip, explore destinations, book experiences, and create unforgettable memories.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Exploreden - Travel Planning Made Easy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@exploreden",
    creator: "@exploreden",
    title: "Exploreden - Your Ultimate Travel Planning Companion",
    description:
      "Discover your next adventure with Exploreden. Plan your perfect trip, explore destinations, book experiences, and create unforgettable memories.",
    images: ["/twitter-image.jpg"],
  },

  alternates: {
    canonical: "https://exploreden.com.au",
  },
  category: "travel",
  classification: "Travel & Tourism",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PKDVCW25');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
         {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKDVCW25"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <AuthProvider>
          <WishlistProvider>
            <BookingProvider>
              <CurrencyProvider>
                <Providers>
                  <NavBar />
                  {children}
                </Providers>
              </CurrencyProvider>
            </BookingProvider>
          </WishlistProvider>
        </AuthProvider>
        <BackToTop />
        <Toaster />
        <Script
          src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
          strategy="beforeInteractive"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Exploreden",
              url: "https://exploreden.com.au",
              logo: "https://exploreden.com.au/icons/logo.svg",
              description:
                "Your ultimate travel planning companion for discovering and booking amazing travel experiences.",
              sameAs: [
                "https://www.linkedin.com/company/exploreden",
                "https://www.facebook.com/profile.php?id=61554941020324",
                "https://www.youtube.com/@ExploreDen",
                "https://www.instagram.com/official_exploreden/",
                "https://www.tiktok.com/@exploreden_official?lang=en-GB",
              ],
            }),
          }}
        />

        {/* Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Exploreden",
              url: "https://exploreden.com.au",
              description:
                "Discover your next adventure with Exploreden. Plan your perfect trip, explore destinations, book experiences, and create unforgettable memories.",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://exploreden.com.au/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
