import { cn } from '@/lib/utils'
import React from 'react'

const ShimmerContainer = ({ width, height, className }: { width: string, height: string, className?: string }) => {
    return (
        <div style={{ width: width, height: height }} className={cn(` animate-pulse  bg-primary-50 rounded`, className)}>

        </div>
    )
}

export default ShimmerContainer
