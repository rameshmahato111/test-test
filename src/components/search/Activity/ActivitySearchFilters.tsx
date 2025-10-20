'use client';
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Stars from '@/components/Details_page/Stars'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoriesApi } from '@/services/api/categories';
import { Category } from '@/schemas/categories';

const ActivitySearchFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const isFiltersApplied = searchParams.get('star') != undefined || searchParams.get('budget') != undefined || searchParams.get('category') != undefined || searchParams.get('start_date') != undefined || searchParams.get('end_date') != undefined


    const handleResetFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('star');
        params.delete('budget');
        params.delete('category');
        params.delete('start_date');
        params.delete('end_date');
        params.delete('city');

        params.delete('start_date');
        params.delete('end_date');

        router.push(`?${params.toString()}`);
    }

    const handleStarChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('star', value);
        router.push(`?${params.toString()}`);
    }

    const handleBudgetChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('budget', value);
        router.push(`?${params.toString()}`);
    }

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('category', value);
        router.push(`?${params.toString()}`);
    }
    return (
        <div className='hidden lg:block rounded-[16px] bg-background w-full max-w-[300px] py-6 px-4 border border-gray-200'>
            <p className='text-gray-700 text-sm font-normal pb-4'>Search results in <span className='font-bold'>{searchParams.get('city')}</span></p>
            <div className="pb-4">
                <Button
                    disabled={!isFiltersApplied}
                    onClick={handleResetFilters}
                    variant="outline"
                    className="w-full"
                >
                    Reset Filters
                </Button>
            </div>
            <StarFilter selectedStar={searchParams.get('star') || undefined} onChange={handleStarChange} />
            <BudgetFilter selectedBudget={searchParams.get('budget') || undefined} onChange={handleBudgetChange} />
            <CategoryFilter selectedCategory={searchParams.get('category') || undefined} onChange={handleCategoryChange} />
        </div>
    )
}

export const StarFilter = ({ selectedStar, onChange }: { selectedStar: string | undefined, onChange: (value: string) => void }) => {
    return (
        <>
            <h3 className='text-base font-medium text-gray-700 pb-4'>Star</h3>
            <RadioGroup
                value={selectedStar ?? ''}
                onValueChange={(value) => onChange(value)}
                className="flex flex-col pb-6"
            >
                {[5, 4, 3, 2, 1].map((star) => (
                    <StarFilterItem key={star} star={star} />
                ))}
            </RadioGroup>
        </>
    );
}

const StarFilterItem = ({ star }: { star: number }) => {
    return (
        <div className="flex items-center gap-4">
            <RadioGroupItem value={`${star}`} className='w-5 h-5' id={`${star}-star`} />
            <Label htmlFor={`${star}-star`}><Stars rating={star} /></Label>
        </div>
    );
}

export const BudgetFilter = ({ selectedBudget, onChange }: { selectedBudget: string | undefined, onChange: (value: string) => void }) => {
    const budgetTypes = [{ id: 1, type: 'economic', icon: '/icons/economic.png' }, { id: 2, type: 'standard', icon: '/icons/standard.png' }, { id: 3, type: 'luxury', icon: '/icons/luxury.png' }];
    return (
        <div className='text-gray-700 py-6 border-y border-gray-200'>
            <h3 className='text-base font-medium mb-4'>Budget</h3>
            <div className='flex gap-2'>
                {budgetTypes.map((type) => (
                    <BudgetFilterItem
                        key={type.id}
                        type={type}
                        isSelected={type.type === selectedBudget}
                        onClick={() => onChange(type.type)}
                    />
                ))}
            </div>
        </div>
    );
}

const BudgetFilterItem = ({ type, isSelected, onClick }: { type: { id: number, type: string, icon: string }, isSelected: boolean, onClick: () => void }) => {
    return (
        <div
            className={cn(
                'flex-1 text-center bg-background shadow-searchShadow border border-gray-200 px-3 rounded-lg cursor-pointer py-[14px]',
                isSelected && 'border-primary-400 bg-primary-0'
            )}
            onClick={onClick}
        >
            <img src={type.icon} alt={type.type} className='w-10 h-10 text-yellow-50 mx-auto text-center' />
            <p className='text-xs text-gray-800 font-normal pt-2 capitalize'>{type.type}</p>
        </div>
    );
}

export const CategoryFilter = ({ selectedCategory, onChange }: { selectedCategory: string | undefined, onChange: (value: string) => void }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await categoriesApi.getCategories();
            setCategories(categories);
        };
        fetchCategories();
    }, []);

    return (
        <div className='py-6'>
            <h3 className='text-base font-medium pb-4'>Category</h3>
            <div className='flex gap-2 flex-wrap'>
                {categories.map((category) => (
                    <CategoryFilterItem
                        key={category.id}
                        category={category.name}
                        isSelected={category.code === selectedCategory}
                        onClick={() => onChange(category.code)}
                    />
                ))}
            </div>
        </div>
    );
}

const CategoryFilterItem = ({ category, isSelected, onClick }: { category: string, isSelected: boolean, onClick: () => void }) => {
    return (
        <p
            className={cn(
                'cursor-pointer rounded-lg border border-gray-200 px-[10px] py-1 text-sm text-gray-800 font-normal',
                isSelected && 'border-primary-400 bg-primary-0'
            )}
            onClick={onClick}
        >
            {category}
        </p>
    );
}

export default ActivitySearchFilters
