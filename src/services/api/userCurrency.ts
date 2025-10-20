import { API_BASE_URL, handleResponse } from "./client";
import { getHeaders } from "../headers";
import { UserCurrencyResponse, UpdateUserCurrencyRequest } from "./types/userCurrency";

export class UserCurrencyService {
    private static instance: UserCurrencyService;
    private readonly baseUrl = `${API_BASE_URL}/core/interest/`;

    private constructor() {}

    public static getInstance(): UserCurrencyService {
        if (!UserCurrencyService.instance) {
            UserCurrencyService.instance = new UserCurrencyService();
        }
        return UserCurrencyService.instance;
    }

    /**
     * Fetches user's currency preference
     * @returns Promise with user currency response
     */
    async getUserCurrency(token: string): Promise<UserCurrencyResponse> {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: getHeaders(token),
            credentials: 'include',
        });

        return handleResponse<UserCurrencyResponse>(response);
    }

    /**
     * Updates user's currency preference
     * @param currencyId - ID of the selected currency
     * @returns Promise with updated user currency response
     */
    async updateUserCurrency(token: string, currencyId: number, countryId?: number): Promise<UserCurrencyResponse> {
        // First try to get existing user currency to preserve the country ID
        let existingCountryId = countryId;
        if (!existingCountryId) {
            try {
                const currentPreference = await this.getUserCurrency(token);
                // @ts-ignore
                existingCountryId = currentPreference.country?.id;
            } catch (error) {
                console.warn('Could not fetch existing user currency preference:', error);
            }
        }

        const payload: UpdateUserCurrencyRequest = {
            segment: [], // Empty array as per requirement
            currency: currencyId,
            country: existingCountryId || 1 // Fallback to ID 1 if no existing country
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: getHeaders(token),
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        return handleResponse<UserCurrencyResponse>(response);
    }
}

export const userCurrencyService = UserCurrencyService.getInstance();
