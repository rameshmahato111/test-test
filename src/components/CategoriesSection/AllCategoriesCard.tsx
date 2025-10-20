'use client'
import React from 'react'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '../ui/menubar'

import { CategoryResponse } from '@/schemas/categories';
import { useRouter } from 'next/navigation';

const AllCategoriesCard = ({ categories }: { categories: CategoryResponse }) => {
    const router = useRouter();
    return (
        <Menubar className="border-none p-0">
            <MenubarMenu >
                <MenubarTrigger className="  p-0 border-none">
                    <div
                        className={`p-3 cursor-pointer hover:bg-primary-0 hover:border-primary-400 duration-300  rounded-xl  text-center border border-gray-200 bg-background shadow-categoryShadow w-[132px] h-[132px] flex flex-col items-center justify-center`}
                    >
                        <img src="/icons/all-categories.svg" alt="All Categories icon" className="mx-auto h-6 w-6 " />
                        <p className="text-xs font-normal text-gray-800 pt-3 ">All Categories</p>
                    </div>
                </MenubarTrigger>
                <MenubarContent align="end" className="bg-background max-h-[300px] space-y-2 rounded-lg p-4 overflow-y-auto">
                    {categories.map((category) => (
                        <MenubarItem onClick={() => router.push(`/all/category?id=${category.id}&category=${encodeURIComponent(category.name)}`)} className="text-gray-800 hover:bg-primary-0 duration-300 cursor-pointer" key={category.id}>{category.name}</MenubarItem>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default AllCategoriesCard;
