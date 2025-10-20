'use client'

import { NAV_LINKS } from "@/data/staticData";
import { useState, useEffect } from "react";
import UserNabAccount from "./UserNabAccount";
import Wrapper from "../Wrapper";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencySelector from "./CurrencySelector";
import MobileCurrencySelector from "./MobileCurrencySelector";

import Link from "next/link";
import Image from "next/image";
import Logo from '../../../public/icons/logo.svg'
import DownloadBtn from "./DownloadBtn";
import { Menu, ChevronDown } from "lucide-react";

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isItinifyOpen, setIsItinifyOpen] = useState(false);
  const itinifyCloseTimer = typeof window !== 'undefined' ? (window as any) : null;
  const [isMobileCurrencySelectorOpen, setIsMobileCurrencySelectorOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrency('USD');
    }
  }, [isAuthenticated, setCurrency]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Wrapper>
      <header className="flex shadow-cardShadow  justify-between items-center py-4 px-4 md:px-4 lg:px-10 relative ">


        <div className="flex items-center gap-4 relative z-50">
          {/* Mobile menu button */}
          <button
            aria-label="Open menu"
            aria-describedby="open-menu-description"
            className="md:hidden cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5 text-gray-700 " />
          </button>

          {/* Logo */}
          <Link prefetch={false} href="/" className="group">
            <Image
              priority
              src={Logo}
              alt="Exploreden logo"
              height={0}
              width={0}
              className="object-contain h-auto w-auto "
              unoptimized
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:gap-8 relative z-50">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {NAV_LINKS.map((link, index) => {
              const isItinify = link.label === "Itinify";
              if (!isItinify && link.href) {
                return (
                  <Link
                    prefetch={false}
                    className="relative text-sm lg:text-base font-medium text-gray-800 transition-all duration-300 hover:text-primary-400 transform hover:scale-105 group"
                    href={link.href}
                    key={link.id}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInTop 0.6s ease-out forwards'
                    }}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
                    <span className="absolute inset-0 bg-primary-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  </Link>
                );
              }

              if (isItinify) {
                const handleEnter = () => {
                  if (itinifyCloseTimer && (itinifyCloseTimer.__itinifyTimeoutId !== undefined)) {
                    clearTimeout(itinifyCloseTimer.__itinifyTimeoutId);
                    itinifyCloseTimer.__itinifyTimeoutId = undefined;
                  }
                  setIsItinifyOpen(true);
                };
                const handleLeave = () => {
                  if (itinifyCloseTimer) {
                    itinifyCloseTimer.__itinifyTimeoutId = setTimeout(() => {
                      setIsItinifyOpen(false);
                    }, 180);
                  } else {
                    setIsItinifyOpen(false);
                  }
                };
                return (
                  <div
                    key={link.id}
                    className="relative flex items-center"
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setIsItinifyOpen((v) => !v)}
                      className="relative inline-flex items-center gap-1 text-sm lg:text-base font-medium text-gray-800 transition-all duration-300 hover:text-primary-400 transform hover:scale-105 group align-middle"
                      aria-haspopup="menu"
                      aria-expanded={isItinifyOpen}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isItinifyOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
                      <span className="absolute inset-0 bg-primary-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                    </button>

                    {isItinifyOpen && (
                      <div
                        role="menu"
                        className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 p-2 z-[60]"
                      >
                        <Link
                          prefetch={false}
                          href="/itinerary"
                          className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-pink-50 hover:text-primary-500 transition-colors"
                          role="menuitem"
                        >
                          Itinerary Generator
                        </Link>
                        <Link
                          prefetch={false}
                          href="/itinerary-trip"
                          className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-pink-50 hover:text-primary-500 transition-colors"
                          role="menuitem"
                        >
                          My Itineraries
                        </Link>
                      </div>
                    )}
                    {/* Invisible hover buffer to avoid gap between trigger and menu */}
                    <div className="absolute left-0 top-full w-full h-3" />
                  </div>
                );
              }

              return (
                <div
                  key={link.id}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInTop 0.6s ease-out forwards'
                  }}
                >
                  <DownloadBtn className="text-sm lg:text-base font-medium text-gray-800 hover:text-primary-400 transition-all duration-300" />
                </div>
              );
            })}
          </nav>

          {/* Currency Selector */}
          {isAuthenticated && (
            <div className="hidden md:block transform transition-all duration-300 hover:border-primary-400">
              <CurrencySelector
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
                className="hover:shadow-md transition-shadow duration-300"
              />
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="cursor-pointer">
                <UserNabAccount imageUrl={user?.profile_picture} />
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/register" className="group">
                  <button aria-label="Sign up" aria-describedby="sign-up-description" className="relative border px-3 py-2 text-xs lg:text-sm font-medium border-primary-400 text-primary-400 rounded-lg overflow-hidden ">
                    {/* Background slide effect */}
                    <span className="absolute inset-0 bg-primary-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">Sign Up</span>
                  </button>
                </Link>

                <Link href="/login" className="group">
                  <button aria-label="Log in" aria-describedby="log-in-description" className="relative border border-primary-400 bg-primary-400 text-background text-xs lg:text-sm font-semibold px-3 py-2 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
                    {/* Shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative z-10">Log In</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedCurrency={currency}
        onCurrencyClick={() => setIsMobileCurrencySelectorOpen(true)}
      />
      <MobileCurrencySelector
        isOpen={isMobileCurrencySelectorOpen}
        onClose={() => setIsMobileCurrencySelectorOpen(false)}
        selectedCurrency={currency}
        onCurrencyChange={setCurrency}
      />
    </Wrapper>
  );
};

export default NavBar;
