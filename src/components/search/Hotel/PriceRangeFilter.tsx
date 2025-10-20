import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { formatNumberWithCommas } from '@/utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceRangeFilterProps {
    isLoading?: boolean;
    exchangeRate: number | null;
}

const PriceRangeFilter = ({ exchangeRate }: PriceRangeFilterProps) => {
    const { currency } = useCurrency();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for visual updates while sliding (always in base currency - USD)
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

    // Update local state while sliding
    const handlePriceRangeChange = (value: number[]) => {
        setPriceRange(value);
    };

    // Convert values for API (apply exchange rate if available)
    const getApiValue = (value: number) => {
        return exchangeRate ? Math.round(value * exchangeRate) : value;
    };

    // Only update URL when sliding is complete
    const handleValueCommit = (value: number[]) => {
        if (value[0] === 0 && value[1] === 10000) {
            // Reset to default - remove params from URL
            const params = new URLSearchParams(searchParams);
            params.delete('minRate');
            params.delete('maxRate');
            router.push(`?${params.toString()}`);
        } else {
            // Update URL with converted values for API
            const params = new URLSearchParams(searchParams);
            params.set('minRate', getApiValue(value[0]).toString());
            params.set('maxRate', getApiValue(value[1]).toString());
            router.push(`?${params.toString()}`);
        }
    };

    // Initialize slider values based on URL params
    useEffect(() => {
        const urlMinRate = searchParams.get('minRate');
        const urlMaxRate = searchParams.get('maxRate');

        if (urlMinRate || urlMaxRate) {
            // URL params exist - convert them back to base currency for slider
            const minValue = urlMinRate ? parseInt(urlMinRate) : 0;
            const maxValue = urlMaxRate ? parseInt(urlMaxRate) : 10000;

            const baseMinRate = exchangeRate ? Math.round(minValue / exchangeRate) : minValue;
            const baseMaxRate = exchangeRate ? Math.round(maxValue / exchangeRate) : maxValue;

            setPriceRange([baseMinRate, baseMaxRate]);
        } else {
            // No URL params - use default values
            setPriceRange([0, 10000]);
        }
    }, [searchParams, exchangeRate]);

    // Calculate display values with exchange rate (for UI display only)
    const getDisplayValue = (value: number) => {
        return exchangeRate ? Math.round(value * exchangeRate) : value;
    };

    return (
        <div className='pb-6 pt-4'>
            <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
            <Slider
                defaultValue={[0, 10000]}
                max={10000}
                min={0}
                step={100}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handleValueCommit}
                className="mb-6"
            />
            <div className="flex justify-between items-center gap-4">
                <div className="border border-gray-200 shadow-cardShadow bg-background items-center px-2 py-1 flex gap-2 relative">
                    <p className="text-xs text-gray-500">{currency}</p>
                    <p className='text-sm text-gray-500'>{formatNumberWithCommas(getDisplayValue(priceRange[0]))}</p>
                </div>
                <div className="border border-gray-200 shadow-cardShadow bg-background items-center px-2 py-1 flex gap-2 relative">
                    <p className="text-xs text-gray-500">{currency}</p>
                    <p className='text-sm text-gray-500'>{formatNumberWithCommas(getDisplayValue(priceRange[1]))}+</p>
                </div>
            </div>
        </div>
    );
};

export default PriceRangeFilter; 