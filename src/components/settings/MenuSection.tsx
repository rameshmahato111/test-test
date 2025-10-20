import React from 'react';
import MenuItem from './MenuItem';
import { MenuSectionProps } from '@/types/settings';

const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
    return (
        <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground pb-4">{title}</h3>
            <div>
                {items.map((item, index) => (
                    <MenuItem
                        key={index}
                        href={item.href}
                        label={item.label}
                        iconName={item.iconName}
                    />
                ))}
            </div>
        </div>
    );
};

export default MenuSection;
