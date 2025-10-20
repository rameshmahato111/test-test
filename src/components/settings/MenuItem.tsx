'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { MenuItemProps } from '@/types/settings';
import { usePathname } from 'next/navigation';
import { iconMap } from '@/configs/settings-menu';

const MenuItem: React.FC<MenuItemProps> = ({ iconName, label, href }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    const Icon = iconName ? iconMap[iconName as keyof typeof iconMap] : null;

    return (
        <Link
            href={href}
            className={cn(
                'flex items-center text-base font-medium gap-3 px-2 py-5 border-b border-gray-200 transition-colors',
                isActive ? 'text-primary-400' : 'text-gray-800 hover:text-primary-400'
            )}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {label}
        </Link>
    );
};

export default MenuItem;
