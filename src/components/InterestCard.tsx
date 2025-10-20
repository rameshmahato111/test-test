import React from 'react'

interface InterestCardProps {
    iconSrc: string;
    label: string;
    className?: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const InterestCard = ({
    iconSrc,
    label,
    className,
    isSelected,
    onClick,
}: InterestCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`p-3 cursor-pointer duration-300 rounded-xl min-w-[90px] h-[88px] text-center border 
            ${isSelected
                    ? 'bg-primary-50 border-primary-400'
                    : 'bg-background border-gray-200 hover:bg-primary-0 hover:border-primary-400'
                } shadow-categoryShadow ${className}`}
        >
            <img src={iconSrc} alt={label} className="mx-auto h-6 w-6 " />
            <p className="text-xs font-normal text-gray-800 pt-3 ">{label}</p>
        </div>
    )
}

export default InterestCard;
