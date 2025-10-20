"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Clock, ChevronDown, ChevronUp, Hourglass, Globe, Phone, Bookmark } from "lucide-react"
import Image from "next/image"

interface RestaurantDetailsProps {
  triggerPosition?: { x: number; y: number }
  onClose?: () => void
}

export default function MapItineraryDetails({ triggerPosition, onClose }: RestaurantDetailsProps) {
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about")
  const [hoursExpanded, setHoursExpanded] = useState(false)
  const [position, setPosition] = useState<{
    vertical: "top" | "bottom" | "center"
    horizontal: "left" | "right" | "center"
  }>({
    vertical: "center",
    horizontal: "center",
  })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (triggerPosition && modalRef.current) {
      requestAnimationFrame(() => {
        if (!modalRef.current) return

        const modalHeight = modalRef.current.offsetHeight
        const modalWidth = modalRef.current.offsetWidth
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        const triggerY = triggerPosition.y
        const triggerX = triggerPosition.x

        const verticalMargin = window.innerWidth < 640 ? 20 : 60
        const horizontalMargin = window.innerWidth < 640 ? 16 : 40

        const spaceAbove = triggerY
        const spaceBelow = viewportHeight - triggerY
        const spaceLeft = triggerX
        const spaceRight = viewportWidth - triggerX

        let verticalPos: "top" | "bottom" | "center" = "center"
        if (spaceBelow >= modalHeight + verticalMargin) {
          verticalPos = "bottom"
        } else if (spaceAbove >= modalHeight + verticalMargin) {
          verticalPos = "top"
        } else {
          verticalPos = "center"
        }

        let horizontalPos: "left" | "right" | "center" = "center"
        if (spaceRight >= modalWidth / 2 + horizontalMargin && spaceLeft >= modalWidth / 2 + horizontalMargin) {
          horizontalPos = "center"
        } else if (spaceRight < modalWidth / 2 + horizontalMargin) {
          horizontalPos = "left"
        } else if (spaceLeft < modalWidth / 2 + horizontalMargin) {
          horizontalPos = "right"
        }

        setPosition({ vertical: verticalPos, horizontal: horizontalPos })
      })
    }
  }, [triggerPosition])

  const getPositionStyles = () => {
    if (!triggerPosition) return undefined

    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 50,
    }

    const isMobile = window.innerWidth < 640

    if (position.vertical === "center") {
      styles.top = "50%"
      styles.transform = position.horizontal === "center" ? "translate(-50%, -50%)" : "translateY(-50%)"
    } else if (position.vertical === "top") {
      const bottomSpace = window.innerHeight - triggerPosition.y + (isMobile ? 10 : 20)
      styles.bottom = `${Math.min(bottomSpace, window.innerHeight - 100)}px`
    } else {
      const topSpace = triggerPosition.y + (isMobile ? 10 : 20)
      styles.top = `${Math.max(topSpace, 80)}px`
    }

    if (position.horizontal === "center") {
      styles.left = "50%"
      if (position.vertical === "center") {
        styles.transform = "translate(-50%, -50%)"
      } else {
        styles.transform = "translateX(-50%)"
      }
    } else {
      styles.left = isMobile ? "0.5rem" : "1rem"
      styles.right = isMobile ? "0.5rem" : "1rem"
    }

    return styles
  }

  return (
    <div
      ref={modalRef}
      className="relative w-full max-w-[calc(100vw-1rem)] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transition-all duration-300"
      style={getPositionStyles()}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 rounded-full bg-white hover:bg-gray-50 shadow-lg w-10 h-10 sm:w-11 sm:h-11"
      >
        <X className="w-5 h-5" />
      </Button>

      <Card className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-8rem)]">
        <div className="flex gap-6 sm:gap-8 px-4 sm:px-6 pt-4 sm:pt-6 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-2.5 sm:pb-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === "about" ? "text-pink-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            About
            {activeTab === "about" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2.5 sm:pb-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === "reviews" ? "text-pink-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews
            {activeTab === "reviews" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />}
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {activeTab === "about" ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Light Bavarian Breakfast</h3>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                    <Badge variant="secondary" className="text-xs sm:text-sm font-normal">
                      Restaurant
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-pink-500 hover:text-pink-600 hover:bg-pink-50 -ml-2 h-8 sm:h-9 text-xs sm:text-sm"
                    >
                      <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      Add to trip
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 mb-4 sm:mb-6">
                    <span className="text-base sm:text-lg font-semibold">4.7</span>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base sm:text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full sm:w-48 h-40 sm:h-32 rounded-xl overflow-hidden sm:flex-shrink-0">
                  <Image
                    src="/images/default-city.jpeg"
                    alt="Orange VW van"
                    width={192}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2.5 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                  <span className="break-words">Av. Gustave munich, 75007 Germany</span>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <button
                      onClick={() => setHoursExpanded(!hoursExpanded)}
                      className="flex items-center gap-2 hover:text-gray-800 transition-colors w-full text-left"
                    >
                      <span className="break-words">Open · 10 AM - 6 PM · Everyday</span>
                      {hoursExpanded ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>

                    {hoursExpanded && (
                      <div className="mt-3 space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span>Sunday</span>
                          <span>: 11AM - 6PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monday</span>
                          <span>: 11AM - 6PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tuesday</span>
                          <span>: 11AM - 6PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wednesday</span>
                          <span>: 11AM - 6PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thursday</span>
                          <span>: 11AM - 6PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Friday</span>
                          <span>: 10AM - 4PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday</span>
                          <span>: 10AM - 4PM</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Average waiting time · 10 mins</span>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <a
                    href="https://www.tour.germany/ger"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors truncate"
                  >
                    https://www.tour.germany/ger
                  </a>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <a href="tel:+15147897899" className="hover:text-pink-500 transition-colors">
                    +1 514-789-789
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-base sm:text-lg">James Watson</h4>
                <p className="text-xs sm:text-sm text-gray-500">Aug 5, 2025</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm sm:text-base">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">from Google</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Incredible sightseeing that you must see at least once in your life! It was more spectacular in real
                  life. We bought tickets to go to the top of the tower.
                </p>
              </div>

              <div className="space-y-2 pt-4 sm:pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-base sm:text-lg">William Watson</h4>
                <p className="text-xs sm:text-sm text-gray-500">Aug 5, 2025</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm sm:text-base">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">from Google</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  It was great to see Paris again from the second floor of Eiffel tower. It wasn't too crowded. We
                  walked up the stairs.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
