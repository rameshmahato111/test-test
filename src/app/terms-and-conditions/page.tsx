import React from 'react'
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms and Conditions - Exploreden',
    description: 'Read our terms and conditions for using Exploreden travel planning services. Learn about user responsibilities, service usage guidelines, and legal agreements.',
    keywords: [
        'terms and conditions',
        'Exploreden terms',
        'travel service terms',
        'user agreement',
        'service agreement',
        'legal terms',
        'website terms',
        'travel booking terms'
    ],
    openGraph: {
        title: 'Terms and Conditions - Exploreden',
        description: 'Read our terms and conditions for using Exploreden travel planning services.',
        url: 'https://exploreden.com.au/terms-and-conditions',
    },
    twitter: {
        title: 'Terms and Conditions - Exploreden',
        description: 'Read our terms and conditions for using Exploreden travel planning services.',
    },
    alternates: {
        canonical: 'https://exploreden.com.au/terms-and-conditions',
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
                            Terms and Conditions
                        </h1>
                    </header>

                    <section className="px-6 md:px-8 py-6">
                        <p className="mb-4 text-foreground">Welcome to exploreden.com!</p>
                        <p className="mb-4 text-gray-700">
                            These terms and conditions outline the rules and regulations for the
                            use of ExploreDen's Website, located at https://exploreden.com.au/.
                        </p>
                        <p className="mb-4 text-gray-700">
                            By accessing this website we assume you accept these terms and
                            conditions. Do not continue to use exploreden.com if you do not
                            agree to take all of the terms and conditions stated on this page.
                        </p>

                        {/* Membership Terms Reference */}
                        <div className="mb-6 p-4 bg-primary-50 rounded-lg border-l-4 border-primary-400">
                            <h3 className="text-lg font-semibold text-foreground mb-2">Membership Program</h3>
                            <p className="text-gray-700 mb-3">
                                If you are subscribing to or using our Membership Program, additional terms and conditions apply.
                                Please review our separate Membership Terms & Conditions which govern the use of our paid membership services.
                            </p>
                            <a
                                target='_blank'
                                href="/membership-terms-and-condition"
                                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-500 font-medium hover:underline transition-colors"
                            >
                                View Membership Terms & Conditions
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>

                        <p className="mb-6 text-gray-700">
                            The following terminology applies to these Terms and Conditions,
                            Privacy Statement and Disclaimer Notice and all Agreements:
                            "Client", "You" and "Your" refers to you, the person log on this
                            website and compliant to the Company's terms and conditions. "The
                            Company", "Ourselves", "We", "Our" and "Us", refers to our Company.
                            "Party", "Parties", or "Us", refers to both the Client and
                            ourselves. All terms refer to the offer, acceptance and
                            consideration of payment necessary to undertake the process of our
                            assistance to the Client in the most appropriate manner for the
                            express purpose of meeting the Client's needs in respect of
                            provision of the Company's stated services, in accordance with and
                            subject to, prevailing law of au. Any use of the above terminology
                            or other words in the singular, plural, capitalization and/or he/she
                            or they, are taken as interchangeable and therefore as referring to
                            same.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">Cookies</h2>
                        <p className="mb-4 text-gray-700">
                            We employ the use of cookies. By accessing exploreden.com, you
                            agreed to use cookies in agreement with the ExploreDen's Privacy
                            Policy.
                        </p>
                        <p className="mb-4 text-gray-700">
                            Most interactive websites use cookies to let us retrieve the user's
                            details for each visit. Cookies are used by our website to enable
                            the functionality of certain areas to make it easier for people
                            visiting our website. Some of our affiliate/advertising partners may
                            also use cookies.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">License</h2>
                        <p className="mb-4 text-gray-700">
                            Unless otherwise stated, ExploreDen and/or its licensors own the
                            intellectual property rights for all material on exploreden.com. All
                            intellectual property rights are reserved. You may access this from
                            exploreden.com for your own personal use subjected to restrictions
                            set in these terms and conditions.
                        </p>
                        <p className="mb-4 text-gray-700">You must not:</p>
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                            <li>Republish material from exploreden.com</li>
                            <li>Sell, rent or sub-license material from exploreden.com</li>
                            <li>Reproduce, duplicate or copy material from exploreden.com</li>
                            <li>Redistribute content from exploreden.com</li>
                        </ul>
                        <p className="mb-4 text-gray-700">
                            This Agreement shall begin on the date hereof. Our Terms and
                            Conditions were created with the help of the Free Terms and
                            Conditions Generator.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">Comments</h2>
                        <p className="mb-4 text-gray-700">
                            Parts of this website offer an opportunity for users to post and
                            exchange opinions and information in certain areas of the website.
                            ExploreDen does not filter, edit, publish or review Comments prior
                            to their presence on the website. Comments do not reflect the views
                            and opinions of ExploreDen, its agents and/or affiliates. Comments
                            reflect the views and opinions of the person who post their views
                            and opinions.
                        </p>
                        <p className="mb-4 text-gray-700">
                            ExploreDen reserves the right to monitor all Comments and to remove
                            any Comments which can be considered inappropriate, offensive or
                            causes breach of these Terms and Conditions.
                        </p>
                        <p className="mb-4 text-gray-700">You warrant and represent that:</p>
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                            <li>
                                You are entitled to post the Comments on our website and have all
                                necessary licenses and consents to do so;
                            </li>
                            <li>
                                The Comments do not invade any intellectual property right,
                                including without limitation copyright, patent or trademark of any
                                third party;
                            </li>
                            <li>
                                The Comments do not contain any defamatory, libelous, offensive,
                                indecent or otherwise unlawful material which is an invasion of
                                privacy
                            </li>
                            <li>
                                The Comments will not be used to solicit or promote business or
                                custom or present commercial activities or unlawful activity.
                            </li>
                        </ul>
                        <p className="mb-4 text-gray-700">
                            You hereby grant ExploreDen a non-exclusive license to use,
                            reproduce, edit and authorize others to use, reproduce and edit any
                            of your Comments in any and all forms, formats or media.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Hyperlinking to our Content
                        </h2>
                        <p className="mb-4 text-gray-700">
                            The following organizations may link to our Website without prior
                            written approval:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                            <li>Government agencies;</li>
                            <li>Search engines;</li>
                            <li>News organizations;</li>
                            <li>
                                Online directory distributors may link to our Website in the same
                                manner as they hyperlink to the Websites of other listed
                                businesses; and
                            </li>
                            <li>
                                System wide Accredited Businesses except soliciting non-profit
                                organizations, charity shopping malls, and charity fundraising
                                groups which may not hyperlink to our Web site.
                            </li>
                        </ul>
                        <p className="mb-4 text-gray-700">
                            These organizations may link to our home page, to publications or to
                            other Website information so long as the link: (a) is not in any way
                            deceptive; (b) does not falsely imply sponsorship, endorsement or
                            approval of the linking party and its products and/or services; and
                            (c) fits within the context of the linking party's site.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">iFrames</h2>
                        <p className="mb-4 text-gray-700">
                            Without prior approval and written permission, you may not create
                            frames around our Webpages that alter in any way the visual
                            presentation or appearance of our Website.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Content Liability
                        </h2>
                        <p className="mb-4 text-gray-700">
                            We shall not be hold responsible for any content that appears on
                            your Website. You agree to protect and defend us against all claims
                            that is rising on your Website. No link(s) should appear on any
                            Website that may be interpreted as libelous, obscene or criminal, or
                            which infringes, otherwise violates, or advocates the infringement
                            or other violation of, any third party rights.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">Reservation of Rights</h2>
                        <p className="mb-4 text-gray-700">
                            We reserve the right to request that you remove all links or any
                            particular link to our Website. You approve to immediately remove
                            all links to our Website upon request. We also reserve the right to
                            amen these terms and conditions and it's linking policy at any time.
                            By continuously linking to our Website, you agree to be bound to and
                            follow these linking terms and conditions.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">
                            Removal of links from our website
                        </h2>
                        <p className="mb-4 text-gray-700">
                            If you find any link on our Website that is offensive for any
                            reason, you are free to contact and inform us any moment. We will
                            consider requests to remove links but we are not obligated to or so
                            or to respond to you directly.
                        </p>
                        <p className="mb-4 text-gray-700">
                            We do not ensure that the information on this website is correct, we
                            do not warrant its completeness or accuracy; nor do we promise to
                            ensure that the website remains available or that the material on
                            the website is kept up to date.
                        </p>
                    </section>

                    <section className="px-6 md:px-8 py-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground font-inter">Disclaimer</h2>
                        <p className="mb-4 text-gray-700">
                            To the maximum extent permitted by applicable law, we exclude all
                            representations, warranties and conditions relating to our website
                            and the use of this website. Nothing in this disclaimer will:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                            <li>
                                limit or exclude our or your liability for death or personal
                                injury;
                            </li>
                            <li>
                                limit or exclude our or your liability for fraud or fraudulent
                                misrepresentation;
                            </li>
                            <li>
                                limit any of our or your liabilities in any way that is not
                                permitted under applicable law; or
                            </li>
                            <li>
                                exclude any of our or your liabilities that may not be excluded
                                under applicable law.
                            </li>
                        </ul>
                        <p className="mb-4 text-gray-700">
                            The limitations and prohibitions of liability set in this Section
                            and elsewhere in this disclaimer: (a) are subject to the preceding
                            paragraph; and (b) govern all liabilities arising under the
                            disclaimer, including liabilities arising in contract, in tort and
                            for breach of statutory duty.
                        </p>
                        <p className="mb-4 text-gray-700">
                            As long as the website and the information and services on the
                            website are provided free of charge, we will not be liable for any
                            loss or damage of any nature.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default page
