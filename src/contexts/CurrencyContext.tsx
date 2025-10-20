'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { currencyService } from '@/services/api';
import { Currency } from '@/services/api/types/currency';

interface CurrencyContextType {
    currency: string;
    setCurrency: (code: string) => void;
    currencyData: Currency | null;
    nationality: string | null;
    setNationality: (nationality: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'USD',
    setCurrency: () => { },
    currencyData: null,
    nationality: null,
    setNationality: () => { },
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState('USD');
    const [currencyData, setCurrencyData] = useState<Currency | null>(null);
    const [nationality, setNationality] = useState<string | null>(null);
    useEffect(() => {
        const fetchCurrencyData = async () => {
            try {
                const response = await currencyService.getCurrencies();
                const selectedCurrency = response.results.find(c => c.code === currency);
                if (selectedCurrency) {
                    setCurrencyData(selectedCurrency);
                }
            } catch (error) {
                console.error('Failed to fetch currency data:', error);
            }
        };

        fetchCurrencyData();
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, currencyData, nationality, setNationality }}>
            {children}
        </CurrencyContext.Provider>
    );
}
