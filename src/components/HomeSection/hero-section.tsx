"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  image: string
  imageAlt: string
}

const carouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Turn your travel plan",
    subtitle: "into Side Hustle",
    image: "/images/default-city.jpeg",
    imageAlt: "Tropical beach with pink sand and beach chair"
  },
  {
    id: 2,
    title: "Discover. Book. Go.",
    subtitle: "Make every Trip Count",
    image: "/images/hero_bg.png",
    imageAlt: "Beautiful travel destination"
  },
  {
    id: 3,
    title: "Explore the World",
    subtitle: "Your Adventure Awaits",
    image: "/images/city_landscape.jpg",
    imageAlt: "City landscape view"
  },
  {
    id: 4,
    title: "Plan Your Journey",
    subtitle: "Create Unforgettable Memories",
    image: "/images/travel_hub.jpg",
    imageAlt: "Travel hub destination"
  }
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToPrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-full w-full">
        {carouselData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            {/* Background Image with Animation */}
            <div
              className={`h-full w-full transition-transform duration-700 ease-out ${
                index === currentSlide
                  ? "translate-x-0 scale-100"
                  : "translate-x-4 scale-105"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-500/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
            
            {/* Content with Animation - Responsive Alignment */}
            <div className="absolute inset-0 z-20 flex items-center justify-center lg:justify-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
              <div className="max-w-2xl text-center lg:text-left">
                <h1 
                  className={`font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-2 sm:mb-4 drop-shadow-lg transition-all duration-700 ease-out ${
                    index === currentSlide
                      ? "translate-x-0 opacity-100"
                      : "translate-x-[-200px] opacity-0"
                  }`}
                  style={{
                    transitionDelay: index === currentSlide ? "0ms" : "0ms"
                  }}
                >
                  {slide.title}
                </h1>
                <p 
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white/95 drop-shadow-md transition-all duration-700 ease-out ${
                    index === currentSlide
                      ? "translate-x-0 opacity-100"
                      : "translate-x-[-200px] opacity-0"
                  }`}
                  style={{
                    transitionDelay: index === currentSlide ? "200ms" : "0ms"
                  }}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full z-20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / carouselData.length) * 100}%`
          }}
        />
      </div>
    </section>
  )
}
