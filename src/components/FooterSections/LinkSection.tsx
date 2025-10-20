import React from 'react'



const LinkSection = ({ title, links }: { title: string, links: any }) => {
    return (
        <div>
            <h4 className='text-foreground text-lg font-semibold pb-5'>{title}</h4>
            <ul className='space-y-2'>
                {links.map((link: any) => (
                    <li className="flex items-center gap-2" key={link.id}>
                        {link.iconSrc && <img src={link.iconSrc} alt={link.label} className='w-4 h-4' />}
                        <a className='text-base font-medium hover:text-primary-400 transition-all duration-300 text-gray-800' href={link.href}>{link.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LinkSection
