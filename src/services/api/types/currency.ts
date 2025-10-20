export interface Currency {
    id: number;
    code: string;
    description: string;
    type: string;
}

export interface CurrencyResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Currency[];
}
