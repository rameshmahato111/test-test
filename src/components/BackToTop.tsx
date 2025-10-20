'use client'
import { ArrowUpIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false)
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
    }, [])
    return (
        <div title='Back to top' id='back-to-top' aria-label='Back to top' aria-describedby='back-to-top-description' className={`fixed bottom-4 right-4 z-50 opacity-0 transition-all duration-300 ${isVisible ? 'opacity-100' : ''}`}>
            <button type='button' aria-label='Back to top' aria-labelledby='back-to-top' className="bg-primary-400 text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-500 transition-colors duration-300" onClick={scrollToTop}>
                <ArrowUpIcon className="w-4 h-4" />
            </button>
        </div>
    )
}

export default BackToTop
