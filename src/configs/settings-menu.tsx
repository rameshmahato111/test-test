import { CircleUserRound, Star, Ticket, PencilLine, Lock, LogOut, FileText, Contact } from 'lucide-react';
import { MenuSectionProps } from '@/types/settings';

export const iconMap = {
    CircleUserRound,
    Star,
    Ticket,
    PencilLine,
    Lock,
    LogOut,
    FileText,
    Contact,
} as const;

export type IconName = keyof typeof iconMap;

export const userSettingsConfig: MenuSectionProps = {
    title: "User And Settings",
    items: [
        { iconName: "CircleUserRound" as IconName, label: "User Profile", href: "/profile" },
        { iconName: "Ticket" as IconName, label: "My Bookings", href: "/bookings" },
        { iconName: "Star" as IconName, label: "My Reviews", href: "/reviews" },
        { iconName: "PencilLine" as IconName, label: "Edit Interest", href: "/interest" },
        // { label: "Exploreden Reward Program", href: "/rewards" },
        { iconName: "LogOut" as IconName, label: "Logout", href: "/logout" },
    ]
};

export const supportSettingsConfig: MenuSectionProps = {
    title: "Support and help center",
    items: [
        { iconName: "Lock" as IconName, label: "Privacy Policy", href: "/privacy-policy" },
        { iconName: "FileText" as IconName, label: "Terms of Service", href: "/terms-and-conditions" },
        { iconName: "Contact" as IconName, label: "Contact Us", href: "/contact" },
    ]
};
