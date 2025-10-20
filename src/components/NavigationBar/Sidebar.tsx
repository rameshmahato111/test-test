import React, { useState } from 'react';
import { AndroidDownloadLink, IOSDownloadLink, NAV_LINKS } from "@/data/staticData";
import Link from 'next/link';
import { CircleUserRound, X } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import DownloadBtn from './DownloadBtn';
import { detectDevice } from '@/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCurrency: string;
    onCurrencyClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    selectedCurrency,
    onCurrencyClick
}) => {
    const { isAuthenticated, user } = useAuth();
    const [isItinifyOpen, setIsItinifyOpen] = useState(false);
    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/profile');
        onClose();
    };

    const handleDownloadClick = () => {
        const detectedDevice = detectDevice();



        if (detectedDevice === "Desktop" || detectedDevice === "Mac") {

            console.log("Showing QR modal for desktop");

        } else {
            if (detectedDevice === "iOS Device") {
                router.push(IOSDownloadLink, { scroll: false });
            } else {
                router.push(AndroidDownloadLink, { scroll: false });
            }
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-white z-50 w-80 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out md:hidden`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <Link prefetch={false} href="/">
                    <Image priority src="/icons/logo.svg" alt="Exploreden logo" width={160} height={100} />
                </Link>
                <button

                    aria-label="Close sidebar"
                    aria-describedby="close-sidebar-description"
                    onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <X className='w-5 h-5' />
                </button>
            </div>

            <div className="flex flex-col h-full">
                {isAuthenticated ? (
                    <div className='p-4 border-b space-y-4'>
                        <div
                            onClick={handleProfileClick}
                            className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                        >
                            <Avatar className="h-12 w-12 border-2 border-primary-400">
                                {user?.profile_picture ? (
                                    <AvatarImage src={user.profile_picture} alt={user.full_name || 'Profile Picture'} />
                                ) : (
                                    <AvatarFallback>
                                        <CircleUserRound className="h-6 w-6" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <h3 className='font-medium text-gray-900'>{user?.full_name}</h3>
                                <p className='text-sm text-gray-500'>{user?.user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-b">
                        <Button
                            className="w-full bg-primary-400 hover:bg-primary-500 text-sm text-background py-2 rounded-md font-semibold"
                            onClick={() => router.push('/sign-in')}
                        >
                            Log in / Sign up
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full text-sm hover:bg-primary-400 hover:text-background duration-300 text-primary-400 border-primary-400 py-2 mt-2 rounded-md font-semibold"
                        >
                            Download App
                        </Button>
                    </div>
                )}

                <nav className="flex flex-col p-4 space-y-1">
                    {NAV_LINKS.map((link) => {
                        const isItinify = link.label === 'Itinify';
                        if (!isItinify && link.href) {
                            return (
                                <Link
                                    href={link.href || '#'}
                                    key={link.id}
                                    className="py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={onClose}
                                >
                                    {link.label}
                                </Link>
                            );
                        }

                        if (isItinify) {
                            return (
                                <div key={link.id}>
                                    <button
                                        type="button"
                                        onClick={() => setIsItinifyOpen((v) => !v)}
                                        className="w-full flex items-center justify-between py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        aria-expanded={isItinifyOpen}
                                        aria-controls="itinify-submenu"
                                    >
                                        <span>Itinify</span>
                                        <svg className={`w-4 h-4 transition-transform ${isItinifyOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                                    </button>
                                    {isItinifyOpen && (
                                        <div id="itinify-submenu" className="ml-2 mt-1 rounded-xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
                                            <Link
                                                href="/itinerary"
                                                className="block px-3 py-2 text-sm text-gray-800 hover:bg-pink-50 hover:text-primary-500"
                                                onClick={onClose}
                                            >
                                                Itinerary Generator
                                            </Link>
                                            <Link
                                                href="/itinerary-trip"
                                                className="block px-3 py-2 text-sm text-gray-800 hover:bg-pink-50 hover:text-primary-500"
                                                onClick={onClose}
                                            >
                                                My Itineraries
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <button
                                aria-label="Download app"
                                aria-describedby="download-app-description"
                                onClick={handleDownloadClick}
                                key={link.id}
                                className=" py-2.5 px-3 text-start text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Download App
                            </button>
                        );
                    })}

                    <button
                        aria-label="Currency"
                        aria-describedby="currency-description"
                        onClick={onCurrencyClick}
                        className="flex justify-between items-center py-2.5 px-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                    >
                        <span>Currency</span>
                        <span className="text-gray-500">{selectedCurrency}</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
