'use client'
import React, { useState } from 'react'
import InterestCard from '../InterestCard'
import { Button } from '../ui/button'
import { InterestService } from '@/services/api/interest'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ChoiceResponse } from '@/schemas/interest'
import { Loader2 } from 'lucide-react'

const PickInterets = ({ choices }: { choices: ChoiceResponse }) => {


    const { token } = useAuth();
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    const handleCategoryClick = (categoryId: number) => {
        setSelectedCategories((prev) => {
            const isAlreadySelected = prev.some(item => item === categoryId);
            if (isAlreadySelected) {
                return prev.filter(item => item !== categoryId);
            }
            return [...prev, categoryId];
        });

    }
    const handleContinue = async () => {
        setIsLoading(true);
        const response = await InterestService.createInterests(token!, selectedCategories);
        if (response) {
            router.push('/');
        }
        setIsLoading(false);
    }
    const handleSkip = () => {
        router.push('/');
    }
    return (
        <div>
            <div className='flex flex-wrap gap-4 pt-8'>
                {choices.map((choice) => (
                    <InterestCard
                        key={choice.id}
                        iconSrc={choice.image ?? '/images/default-image.png'}
                        label={choice.name}
                        isSelected={selectedCategories.some((selected) => selected === choice.id)}
                        onClick={() => handleCategoryClick(choice.id)}
                    />
                ))}
            </div>
            <Button onClick={handleContinue} disabled={isLoading} className='text-base font-semibold bg-primary-400 text-background hover:bg-primary-500 duration-300 mt-8'>
                Continue {isLoading && <Loader2 className='w-4 h-4 ml-2 animate-spin' />}
            </Button>
            <Button onClick={handleSkip} variant='outline' className='text-base font-semibold bg-background text-primary-400 hover:bg-background hover:text-primary-400 duration-300 mt-8 ml-4'>
                Skip
            </Button>
        </div>
    )
}

export default PickInterets
