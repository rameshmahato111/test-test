'use client'
import InterestShimmer from '@/components/Auth/InterestShimmer';
import InterestCard from '@/components/InterestCard'
import DataStateHandler from '@/components/StateHandlers/DataStateHandler';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { InterestService } from '@/services/api/interest';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'

const page = () => {
    const { token } = useAuth();
    const { toast } = useToast();
    const { data, isLoading: interestsLoading, error: interestsError } = useQuery({
        queryKey: ['interests'],
        queryFn: () => InterestService.getInterests(token!),
        enabled: !!token,
    })
    const { data: choices, isLoading: choicesLoading, error: choicesError } = useQuery({
        queryKey: ['choices'],
        queryFn: () => InterestService.getChoices(),
    })

    const [selectedCategories, setSelectedCategories] = useState<number[]>([])

    React.useEffect(() => {
        if (data?.segment) {
            setSelectedCategories(data.segment);
        }
    }, [data]);



    const handleCategoryClick = (categoryId: number) => {
        setSelectedCategories((prev) => {
            const isAlreadySelected = prev.some(item => item === categoryId);
            if (isAlreadySelected) {
                return prev.filter(item => item !== categoryId);
            }
            return [...prev, categoryId];
        });
    }
    const handleSave = async () => {
        const response = await InterestService.createInterests(token!, selectedCategories);
        if (response) {
            toast({
                title: 'Interests saved',
                description: 'Your interests have been saved successfully',
                variant: 'success',
            })
        }
    }
    const isLoading = interestsLoading || choicesLoading;
    const isEmpty = choices?.length === 0;
    const error = interestsError || choicesError;
    return (
        <div>
            <h1 className="text-base font-semibold text-foreground pb-2">Pick Interests</h1>
            <div>
                <DataStateHandler
                    loadingComponent={<InterestShimmer />}
                    emptyComponent={<div className='text-center text-muted-foreground'>No categories found</div>}
                    errorComponent={<div className='text-center text-muted-foreground'>Error fetching categories</div>}
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    error={error}
                >

                    <div className='flex flex-wrap gap-4 pt-4'>
                        {choices?.map((choice) => (
                            <InterestCard
                                key={choice.id}
                                isSelected={selectedCategories.includes(choice.id)}
                                iconSrc={choice.image ?? '/images/default-image.png'}
                                label={choice.name}
                                onClick={() => handleCategoryClick(choice.id)}
                            />
                        ))}
                    </div>
                </DataStateHandler>
                <Button className=' mt-4 bg-primary-400 text-white' onClick={handleSave} disabled={isLoading}>Save</Button>
            </div>
        </div>
    )
}

export default page
