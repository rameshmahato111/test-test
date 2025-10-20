import { CircleAlert } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SubscriptionPlan, SubscriptionStatus } from '@/types/subscription';




const SubscriptionInfo = ({ currency, originalPrice, farePrice, setSubscriptionType, plans, subscriptionStatus }: { currency: string, originalPrice: string, farePrice: string, setSubscriptionType: (type: 'monthly' | 'annual' | null) => void, plans: SubscriptionPlan[], subscriptionStatus: SubscriptionStatus | null }) => {
    const { token } = useAuth();
    const [tab, setTab] = useState<'annual' | 'monthly'>(subscriptionStatus?.plan?.type || 'monthly');

    const [selected, setSelected] = useState<'discount' | 'no-discount' | null>('discount');
    const discountedPrice = (parseFloat(originalPrice) - parseFloat(farePrice)).toFixed(2);

    useEffect(() => {
        if (subscriptionStatus?.plan?.type) {
            setTab(subscriptionStatus?.plan?.type);
        }
    }, [subscriptionStatus?.plan?.type]);

    // Set initial selection
    useEffect(() => {
        if (selected === 'discount') {
            setSubscriptionType(tab);
        } else if (selected === 'no-discount') {
            setSubscriptionType(null);
        }
    }, [selected, tab, setSubscriptionType]);

    if (!plans) return <div className="p-8 text-center h-[400px] flex items-center justify-center animate-pulse bg-gray-100 rounded-2xl">Loading subscription info...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-cardShadow p-6 my-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 w-fit">
                {plans && plans.map((plan) => (
                    <button
                        aria-label={`Select ${plan.name}`}
                        aria-describedby="select-plan-description"
                        type='button'
                        key={plan.id}
                        className={`px-4 py-1 rounded border  font-medium ${tab === plan.type ? 'bg-white border-gray-300' : 'border-transparent text-gray-500'}`}
                        onClick={() => setTab(plan.type)}
                    >
                        {plan.name}
                    </button>
                ))}
            </div>
            {/* Discounted Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-semibold">
                        Exploreden Membership Benefits
                    </div>
                    {subscriptionStatus?.is_active && (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Active Subscription
                        </div>
                    )}
                </div>

                {/* Membership Benefits */}
                <div className="mb-6">
                    <ul className="mb-4 space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">✅</span>
                            Access exclusive member-only prices on hotels, flights, and activities
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">🧠</span>
                            Free use of Itinify – our smart itinerary builder
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">🛎️</span>
                            Priority customer support for faster help when you need it
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">🚨</span>
                            Early access to flash sales, special offers, and limited deals
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">🔄</span>
                            Enjoy flexible cancellations/rescheduling on selected bookings
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">🏆</span>
                            Participate in leaderboards & giveaways for extra rewards
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">🌐</span>
                            Unlock full access to travel planning tools & member dashboard
                        </li>
                    </ul>
                </div>

                {/* Membership Plans */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Monthly Plan */}
                        {tab === 'monthly' && <div className={`border-2 rounded-lg p-4 ${tab === 'monthly' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">💳</span>
                                <h3 className="font-semibold">Monthly Membership</h3>
                            </div>
                            <div className="text-sm text-gray-800 mb-3">
                                <p>Ideal for casual or seasonal travelers</p>
                                <p>Full access to all benefits</p>
                                <p>Cancel anytime – no commitment</p>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {plans && plans.map((plan) => {
                                    if (plan.type === 'monthly') {
                                        return (
                                            <div key={plan.id}>
                                                {plan.display_currency} {plan.display_price}
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>}

                        {/* Annual Plan */}
                        {tab === 'annual' && <div className={`border-2 rounded-lg p-4 ${tab === 'annual' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🥇</span>
                                <h3 className="font-semibold">Annual Membership</h3>
                            </div>
                            <div className="text-sm text-gray-800 mb-3">
                                <p>Best value – get 2 months FREE compared to monthly</p>
                                <p>Perfect for frequent or family travelers</p>
                                <p>One-time payment, uninterrupted perks all year</p>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {plans && plans.map((plan) => {
                                    if (plan.type === 'annual') {
                                        return (
                                            <div key={plan.id}>
                                                {plan.display_currency} {plan.display_price}
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-gray-900">{currency} {farePrice.toLocaleString()}</span>
                    <span className="text-gray-400 line-through font-medium">{currency} {originalPrice.toLocaleString()}</span>
                </div>

                <button
                    aria-label={`Select ${tab === 'annual' ? 'Annual' : 'Monthly'} membership`}
                    aria-describedby="select-membership-description"
                    type='button'
                    className={`border border-pink-500 text-pink-500 px-6 py-1.5 rounded font-semibold text-sm float-right  transition ${selected === 'discount' ? 'bg-primary-500 text-white' : ''}`}
                    onClick={() => {
                        if (token) {
                            setSelected('discount');
                            setSubscriptionType(tab);
                        } else {
                            toast({
                                title: 'Please login to continue',
                                description: 'You need to be logged in to select a subscription',
                                variant: 'error',
                            })
                        }
                    }}
                >
                    {selected === 'discount' ? 'Selected' : 'Select'}
                </button>
                <div className="clear-both"></div>
                <div className="text-sm text-gray-600 mt-4">
                    By subscribing, you accept the <a target='_blank' href="https://www.exploreden.com.au/membership-terms-and-condition" className="underline text-primary-400">terms and conditions</a>. You can cancel anytime from your account by clicking "cancel my subscription"
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 my-6"></div>

            {/* Price Without Discount */}
            <div className='flex justify-between items-center'>
                <div>
                    <div className="font-semibold text-gray-900 mb-2">Price Without Discount</div>
                    <div className="flex items-center gap-2 text-sm text-yellow-600 mb-2">
                        <CircleAlert className='w-4 h-4' />
                        By selecting this option, the Prime discount of ${discountedPrice} won't be applied
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{currency} {originalPrice}</div>
                </div>
                <button
                    aria-label={`Select no discount`}
                    aria-describedby="select-no-discount-description"
                    type='button'
                    className={`border border-pink-500   px-6 py-1.5 rounded font-semibold text-sm float-right ${selected === 'no-discount' ? ' bg-primary-500 text-white' : 'opacity-60 bg-white text-primary-400'}`}
                    onClick={() => {
                        setSelected('no-discount');
                        setSubscriptionType(null);
                    }}
                >
                    {selected === 'no-discount' ? 'Selected' : 'Select'}
                </button>
            </div>
        </div>
    );
};

export default SubscriptionInfo;
