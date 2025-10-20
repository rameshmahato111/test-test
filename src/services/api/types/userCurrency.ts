import { Currency } from './currency';

interface Country {
    code: string;
    name: string;
    iso_code: string;
}

export interface UserCurrencyResponse {
    id: number;
    user: number;
    segment: number[];
    currency: Currency;
    country: Country;
}

export interface UpdateUserCurrencyRequest {
    segment: number[];
    currency: number;
    country: number;
}
