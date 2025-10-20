export interface SubscriptionPlan {
    id: number;
    name: string;
    price: string;
    type: 'annual' | 'monthly';
    duration_days: number;
    description: string;
    currency: {
        code: string;
        name: string;
    };
    original_currency: string;
    original_price: string;
    display_price: string;
    display_currency: string;
}

export interface SubscriptionStatus {
    plan: {
        id: number;
        name: string;
        price: string;
        type: 'annual' | 'monthly';
        duration_days: number;
        description: string;
        currency: number;
    };
    start_date: string;
    end_date: string;
    is_active: boolean;
}