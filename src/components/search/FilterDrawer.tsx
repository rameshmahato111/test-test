import React, { useMemo } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'




const FilterDrawer = ({ className, Content, type, }: { className?: string, Content?: React.ReactNode, type: string, }) => {

    const searchParams = useSearchParams();
    const router = useRouter();


    const resetFilters = () => {
        if (type === 'hotel') {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('minRate');
            params.delete('maxRate');
            params.delete('min_review_rating');
            params.delete('max_review_rating');
            params.delete('hotel_rating');
            router.push(`/search?${params.toString()}`, { scroll: false });
        } else if (type === 'activity') {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('rating');
            params.delete('budget');
            params.delete('category');
            params.delete('city');
            params.delete('start_date');
            params.delete('end_date');
            params.delete('longitude');
            params.delete('latitude');
            router.push(`/search?${params.toString()}`, { scroll: false });
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className={`rounded-lg w-[240px] border border-gray-200 shadow-categoryShadow ${className}`}>
                    <Button variant='ghost' className='w-full  flex md:justify-between border border-primary-400 justify-center'>
                        <p className='text-sm font-medium text-gray-600 font-inter'>Filter </p>
                        <ChevronDownIcon className='w-4 h-4' />
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl px-4">
                <SheetHeader className="flex flex-row justify-center items-center border-b pb-4">
                    <SheetTitle className="text-lg font-semibold text-center">Filters</SheetTitle>
                </SheetHeader>
                <SheetDescription asChild>

                    {Content}


                </SheetDescription>
                <SheetFooter>
                    <div className='w-full  flex gap-4'>
                        <Button
                            onClick={() => resetFilters()}
                            variant='outline' className='w-full border-primary-400 text-primary-400'>
                            Clear Filters
                        </Button>
                        {/* <Button
                            disabled={!isPendingChanges}
                            onClick={applyFilters}
                            className={cn(
                                "w-full mb-4 bg-primary-400 text-white font-semibold",
                                !isPendingChanges && "opacity-50 cursor-not-allowed"
                            )}>
                            Apply Filters
                        </Button> */}
                    </div>
                </SheetFooter>
            </SheetContent>

        </Sheet>
    )
}

export default FilterDrawer
