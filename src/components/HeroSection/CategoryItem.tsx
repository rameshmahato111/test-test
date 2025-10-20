import React, { useState } from "react";

interface CategoryItemProps {
  iconSrc: string;
  altText: string;
  label: string;
  isActive: boolean;
  className?: string;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  iconSrc,
  altText,
  label,
  isActive,
  onClick,
  className,
}) => {
  const textColor = isActive ? "text-primary-400" : "text-gray-800";

  return (
    <div
      className={`flex items-center gap-2 bg-background px-3 py-1 rounded-lg cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img src={iconSrc} alt={altText} />
      <p className={`text-xs md:text-sm font-normal ${textColor}`}>{label}</p>
    </div>
  );
};

export default CategoryItem;
