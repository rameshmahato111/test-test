import { Metadata } from "next";
import Wrapper from "@/components/Wrapper";
import FAQSection from "@/components/home_page/FAQSection";

export const metadata: Metadata = {
    title: "Frequently Asked Questions - Exploreden",
    description: "Find answers to the most common questions about Exploreden's travel services, booking process, payments, and more. Get help with hotels, activities, and travel experiences.",
    keywords: [
        "FAQ",
        "frequently asked questions",
        "Exploreden help",
        "travel booking questions",
        "customer support",
        "travel agency questions",
        "booking help",
        "travel assistance",
        "Exploreden support"
    ],
    openGraph: {
        title: "Frequently Asked Questions - Exploreden",
        description: "Find answers to the most common questions about Exploreden's travel services, booking process, and support.",
        url: "https://exploreden.com.au/faq",
        images: [
            {
                url: "/og-faq.jpg",
                width: 1200,
                height: 630,
                alt: "Exploreden FAQ - Get Your Questions Answered",
            },
        ],
    },
    twitter: {
        title: "Frequently Asked Questions - Exploreden",
        description: "Find answers to the most common questions about Exploreden's travel services and booking process.",
        images: ["/twitter-faq.jpg"],
    },
    alternates: {
        canonical: "https://exploreden.com.au/faq",
    },
};

export default function FAQPage() {
    return (
        <Wrapper>
            <FAQSection />
        </Wrapper>
    );
} 