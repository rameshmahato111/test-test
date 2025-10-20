import React from 'react'
import { Linkedin, Facebook, Instagram, Twitter, Youtube, Share2, MessageCircle, Send } from 'lucide-react'

interface SocialLinksProps {
    title: string;
    links: any
}

const SocialIcons = {
    linkedin: {
        icon: <Linkedin size={20} />,
        label: 'LinkedIn',
    },
    facebook: {
        icon: <Facebook size={20} />,
        label: 'Facebook',
    },
    instagram: {
        icon: <Instagram size={20} />,
        label: 'Instagram',
    },
    twitter: {
        icon: <Twitter size={20} />,
        label: 'Twitter',
    },
    youtube: {
        icon: <Youtube size={20} />,
        label: 'YouTube',
    },
    tiktok: {
        icon: <img src="/icons/tik-tok.png" alt="TikTok social media icon" className='w-5 h-5' />,
        label: 'TikTok',
    },
    pinterest: {
        icon: <img src="/icons/pinterest-logo.png" alt="Pinterest social media icon" className='w-5 h-5' />,
        label: 'Pinterest',
    },
    whatsapp: {
        icon: <MessageCircle size={20} />,
        label: 'WhatsApp',
    },
    telegram: {
        icon: <Send size={20} />,
        label: 'Telegram',
    },
}

const SocialLinks = ({ title, links }: SocialLinksProps) => {
    const socialLinks = Object.entries(links)
        .filter(([key, value]) => key !== 'id' && value !== null)
        .map(([key, value]) => ({
            platform: key as keyof typeof SocialIcons,
            href: value as string
        }));

    return (
        <div>
            <h4 className='text-foreground text-lg font-semibold pb-5'>{title}</h4>
            <ul className='space-y-2'>
                {socialLinks.map((link, index) => (
                    <li className="flex items-center gap-2" key={index}>
                        {SocialIcons[link.platform].icon}
                        <a
                            className='text-base font-medium hover:text-primary-400 transition-all duration-300 text-gray-800'
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {SocialIcons[link.platform].label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SocialLinks
