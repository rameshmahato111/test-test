'use client'
import { cn } from '@/lib/utils';
import React, { useRef, useState, useEffect } from 'react';

const HorizontalCardScroll = ({ children, className, showArrows = true, stretchItems = true }: { children: React.ReactNode, className?: string, showArrows?: boolean, stretchItems?: boolean }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll();
        }
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, []);


    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth / 2;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className={`${cn("my-4 md:my-8", className)} relative`}>
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 px-2 hide-scrollbar"
            >
                <div className={`inline-flex gap-4 ${stretchItems ? 'items-stretch' : 'items-center'}`}>
                    {React.Children.map(children, (child, i) => (
                        <div className="flex-1" key={i}>{child}</div>
                    ))}
                </div>
                {showArrows && showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className='w-9 h-9 p-2 bg-background hover:bg-[var(--primary-color-50)] shadow-arrowShadow rounded-full absolute top-1/2 -translate-y-1/2 left-0 md:-left-2 transition-colors'
                    >
                        <img src="/icons/right-arrow.svg" alt="left-arrow" className='rotate-180' />
                    </button>
                )}
                {showArrows && showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className='w-9 h-9 p-2 bg-background hover:bg-[var(--primary-color-50)] shadow-arrowShadow rounded-full absolute top-1/2 -translate-y-1/2 right-0 md:-right-6 transition-colors'
                    >
                        <img src="/icons/right-arrow.svg" alt="right-arrow" />
                    </button>
                )}
            </div>

        </section>
    );
};

export default HorizontalCardScroll;
