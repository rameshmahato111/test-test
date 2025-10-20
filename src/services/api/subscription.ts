import { getHeaders } from '../headers';
import { API_BASE_URL, handleResponse } from './client';

export async function getSubscriptionPlans(token: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/core/subscription/list_plans/`, {
            method: 'GET',
            headers: getHeaders(token ?? undefined),
        });
        const data = await res.json();
       
            return data;
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        throw error;
    }
}

export async function getUserSubscriptionStatus(token: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/core/subscription-plan/subscription_status/`, {
            method: 'GET',
            headers: getHeaders(token),
        });
        const data = await res.json();
       
        return data;
    } catch (error) {
        console.error('Error fetching user subscription status:', error);
        throw error;
    }
}
