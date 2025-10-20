import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Account Access - Exploreden",
        template: "%s - Exploreden",
    },
    description: "Access your Exploreden account to manage your travel plans, bookings, and preferences. Sign in or create a new account to start planning your next adventure.",
    keywords: [
        "login",
        "sign in",
        "register",
        "account",
        "travel account",
        "user login",
        "create account",
        "travel planning account"
    ],
    robots: {
        index: false,
        follow: true,
    },

};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
} 