import { cn } from '@/lib/utils'
import React from 'react'

const IconWithText = ({
    text, 
    icon,
    textClassName,
    iconClassName,
    gap,

}:{
    text:string,
    icon:string,
    textClassName?:string,
    iconClassName?:string,
    gap?:string
}) => {
  return (
    <div className={cn('flex items-center gap-1', gap)}>
      <img src={icon} className={cn('h-[18px] w-[18px]', iconClassName)} alt="star" />
        <p className={cn('text-xs font-medium text-gray-700', textClassName)}>{text}</p>
    </div>
  )
}

export default IconWithText
