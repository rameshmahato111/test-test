import React from 'react';
import { Mail, MapPin, Calendar, DollarSign, Shield, RefreshCw, AlertTriangle, Gavel, Phone } from 'lucide-react';

const MembershipTermsAndConditions = () => {
    const currentDate = new Date().toLocaleDateString('en-AU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-10">
                <div className="bg-background shadow-lg rounded-3xl border border-gray-color-200 overflow-hidden">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-primary-400 to-primary-500 text-white py-10 px-6 md:px-8">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                Exploreden Membership
                            </h1>
                            <h2 className="text-xl md:text-2xl font-semibold mb-2">
                                Terms & Conditions
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-white/90">
                                <Calendar className="w-4 h-4" />
                                <p className="text-sm md:text-base">
                                    Effective Date: 01 July 2025
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Introduction */}
                    <section className="px-6 md:px-8 py-8 bg-primary-color-00">
                        <div className="text-center max-w-3xl mx-auto">
                            <p className="text-lg text-foreground leading-relaxed">
                                These Terms & Conditions govern the use of Exploreden's Membership Program.
                                By subscribing to Exploreden's Monthly or Annual Membership, you agree to these Terms.
                                Please read them carefully.
                            </p>
                        </div>
                    </section>

                    {/* Membership Overview */}
                    <section className="px-6 md:px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-primary-400" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                1. Membership Overview
                            </h2>
                        </div>

                        <div className="bg-gray-color-50 rounded-xl p-6 mb-6">
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Exploreden Pty Ltd ("Exploreden", "we", "us", "our") offers two paid membership plans:
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg p-6 border border-gray-color-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Monthly Membership</h3>
                                    <div className="text-3xl font-bold text-primary-400 mb-2">AUD $9.99</div>
                                    <p className="text-gray-600">per month</p>
                                </div>

                                <div className="bg-white rounded-lg p-6 border border-primary-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-primary-400 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                                        SAVE 17%
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Annual Membership</h3>
                                    <div className="text-3xl font-bold text-primary-400 mb-2">AUD $99.99</div>
                                    <p className="text-gray-600">per year</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-primary-50 rounded-lg border-l-4 border-primary-400">
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>Membership Benefits:</strong> Access to exclusive travel benefits including
                                    discounted airfares, hotel deals, early access to promotions, and other members-only features.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Eligibility */}
                    <section className="px-6 md:px-8 py-8 bg-gray-color-50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                2. Eligibility
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Membership is available to individuals aged <strong>18 years or older</strong> with a valid payment method.
                            By subscribing, you confirm that you meet these eligibility criteria.
                        </p>
                    </section>

                    {/* Billing & Payment */}
                    <section className="px-6 md:px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                3. Billing & Payment
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    You will be charged immediately upon subscribing to a plan.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Monthly plans renew every 30 days; annual plans renew every 12 months.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Payments are processed securely via our third-party payment processor.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    All charges are in Australian Dollars (AUD) and inclusive of GST, if applicable.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Auto-Renewal */}
                    <section className="px-6 md:px-8 py-8 bg-gray-color-50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <RefreshCw className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                4. Auto-Renewal
                            </h2>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                            <p className="text-gray-700 leading-relaxed">
                                Your subscription will automatically renew at the end of each billing cycle unless cancelled.
                                By subscribing, you authorise Exploreden to charge your payment method for subsequent billing cycles.
                            </p>
                        </div>
                    </section>

                    {/* Cancellation & Refunds */}
                    <section className="px-6 md:px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                5. Cancellation & Refunds
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    You may cancel your membership anytime via your account dashboard or by contacting
                                    support at <a href="mailto:contact@exploreden.com.au" className="text-primary-400 hover:underline font-medium">
                                        contact@exploreden.com.au
                                    </a>
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Cancellations take effect at the end of the current billing cycle.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>No refunds</strong> are issued for partial or unused periods of membership.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    If Exploreden cancels your membership due to a breach of these terms, no refund will be provided.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Changes to Membership */}
                    <section className="px-6 md:px-8 py-8 bg-gray-color-50">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                            6. Changes to Membership
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Exploreden reserves the right to modify pricing, features, or terms of the membership at any time.
                            We will notify members of any material changes in advance. Continued use after changes constitutes
                            acceptance of the updated terms.
                        </p>
                    </section>

                    {/* Account Responsibility */}
                    <section className="px-6 md:px-8 py-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                            7. Account Responsibility
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Members are responsible for maintaining the confidentiality of their account and password.
                            All activity under your account is your responsibility.
                        </p>
                    </section>

                    {/* Prohibited Use */}
                    <section className="px-6 md:px-8 py-8 bg-gray-color-50">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                            8. Prohibited Use
                        </h2>
                        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                            <p className="text-gray-700 leading-relaxed">
                                Membership is for <strong>personal use only</strong> and may not be transferred, resold,
                                or used for commercial ticketing purposes unless otherwise approved in writing by Exploreden.
                            </p>
                        </div>
                    </section>

                    {/* Termination by Exploreden */}
                    <section className="px-6 md:px-8 py-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                            9. Termination by Exploreden
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to terminate or suspend your membership at any time, with or without cause,
                            including but not limited to misuse, fraud, or violation of these terms.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section className="px-6 md:px-8 py-8 bg-gray-color-50">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                            10. Limitation of Liability
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            To the extent permitted by law, Exploreden shall not be liable for any indirect, incidental,
                            or consequential damages arising from your use of the membership services.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section className="px-6 md:px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Gavel className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                11. Governing Law
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms are governed by the laws of <strong>Western Australia, Australia</strong>.
                            Any disputes will be subject to the exclusive jurisdiction of the courts of Western Australia.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="px-6 md:px-8 py-8 bg-primary-50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <Phone className="w-6 h-6 text-primary-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                12. Contact
                            </h2>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                For questions or support, please contact:
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary-400" />
                                    <a
                                        href="mailto:contact@exploreden.com.au"
                                        className="text-primary-400 hover:underline font-medium"
                                    >
                                        contact@exploreden.com.au
                                    </a>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                                    <div className="text-gray-700">
                                        <p className="font-medium">Exploreden Pty Ltd</p>
                                        <p>ACN 680 151 017</p>
                                        <p>Perth, Western Australia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-6 md:px-8 py-6 bg-gray-800 text-white">
                        <div className="text-center">
                            <p className="text-sm opacity-90">
                                Last updated: {currentDate}
                            </p>
                            <p className="text-xs opacity-75 mt-2">
                                By continuing to use our services, you acknowledge that you have read,
                                understood, and agree to be bound by these Terms & Conditions.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default MembershipTermsAndConditions;
