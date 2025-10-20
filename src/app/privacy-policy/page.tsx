import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Exploreden',
    description: 'Learn how Exploreden protects your privacy and handles your personal data. Read our comprehensive privacy policy covering data collection, usage, and security measures.',
    keywords: [
        'privacy policy',
        'Exploreden privacy',
        'data protection',
        'personal information',
        'data security',
        'privacy protection',
        'user privacy',
        'travel data privacy'
    ],
    openGraph: {
        title: 'Privacy Policy - Exploreden',
        description: 'Learn how Exploreden protects your privacy and handles your personal data.',
        url: 'https://exploreden.com.au/privacy-policy',
    },
    twitter: {
        title: 'Privacy Policy - Exploreden',
        description: 'Learn how Exploreden protects your privacy and handles your personal data.',
    },
    alternates: {
        canonical: 'https://exploreden.com.au/privacy-policy',
    },
    robots: {
        index: true,
        follow: true,
    },
}

const page = () => {
    return (
        <div className="bg-background min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-10">
                <div className="bg-background shadow-cardShadow rounded-3xl border border-gray-200 overflow-hidden">
                    <header className="bg-primary-400 text-background py-8 px-6 md:px-8">
                        <h1 className="text-3xl md:text-4xl font-semibold text-center font-inter">
                            Privacy Policy
                        </h1>
                    </header>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Introduction
                        </h2>
                        <p className="mb-4 text-gray-700">
                            Exploreden ("we," "our," or "us") is committed to protecting your
                            privacy. This Privacy Policy explains how we collect, use, disclose,
                            and safeguard your information when you visit our website
                            exploreden.com, including any other media form, media channel,
                            mobile website, or mobile application related or connected thereto
                            (collectively, the "Site"). Please read this privacy policy
                            carefully. If you do not agree with the terms of this privacy
                            policy, please do not access the site.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Information We Collect
                        </h2>
                        <p className="mb-4 text-gray-700">
                            We may collect information about you in a variety of ways. The
                            information we may collect on the Site includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            <li>
                                <strong className="text-foreground">Personal Data:</strong> Personally identifiable
                                information, such as your name, shipping address, email address,
                                and telephone number, and demographic information, such as your
                                age, gender, hometown, and interests, that you voluntarily give to
                                us when you register with the Site or when you choose to
                                participate in various activities related to the Site, such as
                                online chat and message boards.
                            </li>
                            <li>
                                <strong className="text-foreground">Derivative Data:</strong> Information our servers
                                automatically collect when you access the Site, such as your IP
                                address, your browser type, your operating system, your access
                                times, and the pages you have viewed directly before and after
                                accessing the Site.
                            </li>
                            <li>
                                <strong className="text-foreground">Financial Data:</strong> Financial information, such as
                                data related to your payment method (e.g., valid credit card
                                number, card brand, expiration date) that we may collect when you
                                purchase, order, return, exchange, or request information about
                                our services from the Site.
                            </li>
                            <li>
                                <strong className="text-foreground">Data From Social Networks:</strong> User information from
                                social networking sites, including your name, your social network
                                username, location, gender, birth date, email address, profile
                                picture, and public data for contacts, if you connect your account
                                to such social networks.
                            </li>
                            <li>
                                <strong className="text-foreground">Mobile Device Data:</strong> Device information, such as
                                your mobile device ID, model, and manufacturer, and information
                                about the location of your device, if you access the Site from a
                                mobile device.
                            </li>
                            <li>
                                <strong className="text-foreground">Third-Party Data:</strong> Information from third parties,
                                such as personal information or network friends, if you connect
                                your account to the third party and grant the Site permission to
                                access this information.
                            </li>
                            <li>
                                <strong className="text-foreground">Data From Contests, Giveaways, and Surveys:</strong>{" "}
                                Personal and other information you may provide when entering
                                contests or giveaways and/or responding to surveys.
                            </li>
                        </ul>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Use of Your Information
                        </h2>
                        <p className="mb-4 text-gray-700">
                            Having accurate information about you permits us to provide you with
                            a smooth, efficient, and customized experience. Specifically, we may
                            use information collected about you via the Site to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Create and manage your account.</li>
                            <li>Process your transactions.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Perform administrative functions.</li>
                            <li>Respond to your customer service requests.</li>
                            <li>Improve our website and offerings.</li>
                            <li>
                                Monitor and analyze usage and trends to improve your experience
                                with the Site.
                            </li>
                            <li>Perform other business activities as needed.</li>
                            <li>
                                Prevent fraudulent transactions, monitor against theft, and
                                protect against criminal activity.
                            </li>
                            <li>Notify you of updates to the Site.</li>
                            <li>
                                Request feedback and contact you about your use of the Site.
                            </li>
                            <li>Resolve disputes and troubleshoot problems.</li>
                            <li>Respond to product and customer service requests.</li>
                            <li>Send you a newsletter.</li>
                            <li>Solicit support for the Site.</li>
                        </ul>
                    </section>

                    <section className="px-6 md:px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Security of Your Information
                        </h2>
                        <p className="mb-4 text-gray-700">
                            We use administrative, technical, and physical security measures to
                            help protect your personal information. While we have taken
                            reasonable steps to secure the personal information you provide to
                            us, please be aware that despite our efforts, no security measures
                            are perfect or impenetrable, and no method of data transmission can
                            be guaranteed against any interception or other type of misuse. Any
                            information disclosed online is vulnerable to interception and
                            misuse by unauthorized parties. Therefore, we cannot guarantee
                            complete security if you provide personal information.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Policy for Children
                        </h2>
                        <p className="mb-4 text-gray-700">
                            We do not knowingly solicit information from or market to children
                            under the age of 13. If we learn that we have collected personal
                            information from a child under age 13 without verification of
                            parental consent, we will delete that information as quickly as
                            possible. If you believe we might have any information from or about
                            a child under 13, please contact us at{" "}
                            <a
                                href="mailto:privacy@exploreden.com"
                                className="text-primary-400 hover:text-primary-500 underline"
                            >
                                privacy@exploreden.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default page
