'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CarouselAPI } from '@/services/api/carousel'
import ImageWithTitle from '../ImageWithTitle'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const TopCarousel = ({ type, title }: { type: string, title: string }) => {
    const { data } = useQuery({
        queryKey: ['top-carousel', type],
        queryFn: () => CarouselAPI.getTopCarousel(type)
    })

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )


    if (!data || data.length === 0) {
        return <ImageWithTitle title={title} image='/images/default-landscape.png' />
    }

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[plugin.current]}
            className="relative"
        >
            <CarouselContent>
                {data.map((item) => (
                    <CarouselItem key={item.id}>
                        <ImageWithTitle
                            title={item.name}
                            image={item.image}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
    )
}

export default TopCarousel
