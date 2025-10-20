'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        id: 1,
        question: "What is Exploreden?",
        answer: "Exploreden is a global online travel platform where users can discover and book hotels, activities, and curated travel experiences with ease."
    },
    {
        id: 2,
        question: "Is Exploreden a licensed travel agency?",
        answer: "Yes. Exploreden is an IATA-accredited travel agency, committed to secure and professional travel services."
    },
    {
        id: 3,
        question: "What can I book on Exploreden?",
        answer: "You can book hotels, travel experiences, tours, and activities around the world."
    },
    {
        id: 4,
        question: "Is Exploreden available as a mobile app?",
        answer: "Yes. Our app is available on both Android and iOS. Some features are exclusive to the mobile app experience."
    },
    {
        id: 5,
        question: "How do I search for hotels or experiences?",
        answer: "Use the search bar on our homepage or app, enter your destination, travel dates, and preferences to see available options."
    },
    {
        id: 6,
        question: "What is Itinify by Exploreden?",
        answer: "Itinify is our AI-based itinerary planner that helps you organize your hotel stays and experiences into a day-by-day plan."
    },
    {
        id: 7,
        question: "Do I need to create an account to book?",
        answer: "Yes. You must log in to your Exploreden account to make a booking. This helps us keep your reservations secure, allows you to manage your bookings easily, and ensures a personalized experience."
    },
    {
        id: 8,
        question: "Is there a membership program?",
        answer: "Yes. We offer subscription plan like Adventurer which come with perks like early access to deals, discounts, and travel credits."
    },
    {
        id: 9,
        question: "What payment methods do you accept?",
        answer: "We accept major debit and credit cards, Apple Pay, Google Pay, and selected local payment methods based on your location."
    },
    {
        id: 10,
        question: "Can I cancel or modify my hotel or activity booking?",
        answer: "Yes, depending on the provider's policy. You can check cancellation terms at checkout or in your booking details."
    },
    {
        id: 11,
        question: "How will I receive my booking confirmation?",
        answer: "You'll receive an instant confirmation by email, and all your bookings will also be stored in the \"My Bookings\" section of your account."
    },
    {
        id: 12,
        question: "What if I don't receive a confirmation email?",
        answer: "Check your spam folder first. If it's not there, log in to your account or contact our support team for assistance."
    },
    {
        id: 13,
        question: "How can I contact customer support?",
        answer: "Use the live chat in our app, email us at support@exploreden.com, or message us through the Contact Us page."
    },
    {
        id: 14,
        question: "Are there any hidden charges?",
        answer: "No. We show full pricing up front, including taxes and service fees, before you confirm your booking."
    },
    {
        id: 15,
        question: "Can I book for someone else?",
        answer: "Yes. You can make a booking under your account and add someone else's name as the primary guest or participant."
    },
    {
        id: 16,
        question: "Does Exploreden offer travel insurance?",
        answer: "Currently, we don't offer insurance, but you are encouraged to purchase travel insurance separately if needed."
    },
    {
        id: 17,
        question: "What happens if an experience gets cancelled?",
        answer: "If a tour or activity is cancelled due to weather or operator issues, you'll be eligible for a full refund or rescheduling, based on provider policy."
    },
    {
        id: 18,
        question: "Is my personal and payment information safe?",
        answer: "Yes. We use secure encryption and adhere to global data protection standards to keep your information private and protected."
    },
    {
        id: 19,
        question: "Can I gift hotel stays or experiences to others?",
        answer: "Yes! We offer gift booking options where you can book for a friend or loved one and send a personalized message with the confirmation."
    }
];

const FAQSection = () => {
    const [openItem, setOpenItem] = useState<number | null>(1); // First item open by default

    const toggleItem = (id: number) => {
        setOpenItem(prev => (prev === id ? null : id));
    }

    return (
        <section className="px-4 md:px-8 lg:px-10 mt-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4 transform transition-all duration-500 ">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Find answers to the most common questions about Exploreden and our travel services.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={faq.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg opacity-0 animate-fade-in-up"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: 'both',
                                animation: 'fadeInUp 0.4s ease-out forwards'
                            }}
                        >
                            <button
                                onClick={() => toggleItem(faq.id)}
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                            >
                                <h3 className="text-lg font-medium text-foreground pr-4">
                                    {faq.question}
                                </h3>
                                <div className="flex-shrink-0 transform transition-transform duration-300">
                                    {openItem === faq.id ? (
                                        <ChevronUp className="w-5 h-5 text-primary-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openItem === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-4">
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Our customer support team is here to help you 24/7.
                        </p>
                        <a
                            href="mailto:support@exploreden.com"
                            className="inline-flex items-center px-6 py-3 bg-primary-400 text-white font-medium rounded-lg hover:bg-primary-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection; 