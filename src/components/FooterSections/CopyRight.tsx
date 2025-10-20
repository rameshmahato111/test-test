import { FOOTER_LEGAL_LINKS } from '@/data/staticData'
import React from 'react'

const CopyRight = () => {
    return (
        <div className='flex flex-col md:flex-row justify-center items-center  md:justify-between border-t border-gray-200 gap-5 pt-8 pb-4'>
            <p className='text-gray-800 text-xs font-normal'>Copyright © 2024 Exploreden | All rights reserved</p>
            <ul className='flex  gap-4'>
                {FOOTER_LEGAL_LINKS.map((link) => (
                    <li key={link.id}>
                        <a href={link.href} className='text-gray-800 hover:text-primary-400 transition-all duration-300 text-xs font-normal'>{link.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CopyRight
