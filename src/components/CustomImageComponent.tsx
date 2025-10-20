'use client';
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';
const CustomImageComponent = ({ iconSrc, label, className, width = 24, height = 24 }: { iconSrc: string, label: string, className?: string, width?: number, height?: number }) => {
    return (
        <Image loading='lazy' width={width} height={height}

            src={iconSrc}
            alt={`${label} activity icon`}
            onError={(event) => {
                //@ts-ignore
                event.target.src = "/images/default-image.png";
            }}
            className={cn(`mx-auto  `, className)} />
    )
}

export default CustomImageComponent
