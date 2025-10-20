
import Link from 'next/link';
import React from 'react'
import CustomImageComponent from '../CustomImageComponent';
interface CategoryItemCardProps {
  iconSrc: string;
  label: string;
  className?: string;
  id: number;
  selected?: boolean;
  city?: string;
}

const CategoryItemCard = ({
  iconSrc,
  label,
  className,
  id,
  selected = false,
  city
}: CategoryItemCardProps) => {
  const encodedLabel = encodeURIComponent(label);
  const encodedCity = encodeURIComponent(city || '');
  return (
    <Link prefetch={false} href={`/all/category?id=${id}&category=${encodedLabel}&city=${encodedCity}`} >
      <div
        className={`p-3 z-10 cursor-pointer hover:bg-primary-0 flex flex-col items-center justify-center hover:border-primary-400 duration-300  rounded-xl h-[132px] w-[132px] text-center border border-gray-200 bg-background shadow-categoryShadow ${className} ${selected ? 'border-primary-400 bg-primary-0' : 'border-gray-200'}`}
      >
        <CustomImageComponent width={40} height={40} iconSrc={iconSrc} className='object-cover mix-blend-multiply' label={label} />
        <p className="text-xs font-normal text-gray-800 pt-2 ">{label}</p>
      </div>
    </Link>
  )
}

export default CategoryItemCard
