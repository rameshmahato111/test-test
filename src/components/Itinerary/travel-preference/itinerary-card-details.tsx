"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Star, Clock, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Description } from "@radix-ui/react-dialog"

interface HotelDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  details?: {
    title?: string
    rating?: number
    totalReviews?: number
    description?: string
    images?: Array<{ src: string; alt: string }>
    time?: string
    duration?: string
    openingHours?: {
      openNow?: boolean
      weekdayDescriptions?: string[]
    }
  }
}

export function HotelDetailsModal({ open, onOpenChange, details }: HotelDetailsModalProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    if (!open) {
      setShowFullDescription(false)
      setShowAllImages(false)
    }
  }, [open])

  const images = Array.isArray(details?.images) ? details!.images! : []

  const rating = typeof details?.rating === 'number' ? details.rating : undefined
  const totalReviews = typeof details?.totalReviews === 'number' ? details.totalReviews : undefined

  const visibleImageCount = 5
  const displayedImages = showAllImages ? images : images.slice(0, Math.max(0, visibleImageCount - 1))
  const remainingImagesCount = Math.max(0, images.length - Math.max(0, visibleImageCount - 1))

  const openingHours = details?.openingHours

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] overflow-y-auto p-0 rounded-2xl z-[5000]">
        <Description className="sr-only">Detailed information about the selected hotel</Description>
        <DialogHeader className=" z-10 bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base md:text-lg font-semibold text-foreground">Hotel Details</DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          {/* Hero Image First */}
          {images.length > 0 && (
            <div className="mb-6 relative w-full aspect-[16/9] rounded-xl overflow-hidden min-h-[220px] sm:min-h-[280px] md:min-h-[320px]">
              <Image
                src={displayedImages[0].src}
                alt={displayedImages[0].alt || "image"}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-4">
            {details?.title && (
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
                {details.title}
              </h1>
            )}
            {(typeof rating === 'number' || typeof totalReviews === 'number') && (
              <div className="flex items-center gap-3 flex-wrap mb-4">
                {typeof rating === 'number' && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(rating) ? "fill-pink-500 text-pink-500" : "fill-star-gray text-star-gray"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {typeof rating === 'number' && (
                  <span className="text-base font-semibold text-foreground">{rating.toFixed(1)}</span>
                )}
                {typeof totalReviews === 'number' && (
                  <button className="text-sm text-link-blue underline hover:no-underline">{totalReviews} reviews</button>
                )}
              </div>
            )}
            {(details?.time || details?.duration) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {details?.time && <span>{details.time}</span>}
                {details?.time && details?.duration && <span>•</span>}
                {details?.duration && <span>{details.duration}</span>}
              </div>
            )}
            <div className="mt-4 border-t" />
          </div>

          {/* Optional gallery grid below if expanded */}
          {images.length > 1 && (
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 ${showAllImages ? "auto-rows-fr" : ""}`}>
              {displayedImages.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt || "image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
              {!showAllImages && remainingImagesCount > 0 && (
                <button
                  className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/80 flex items-center justify-center hover:bg-black/70 transition-colors"
                  onClick={() => setShowAllImages(true)}
                >
                  <span className="text-white font-medium text-sm md:text-base">View {remainingImagesCount}+ More</span>
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            {details?.description && (
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                {details.description}
              </p>
            )}
            {showFullDescription && (
              <>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-foreground" />
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">Opening Hours</h2>
                    {openingHours?.openNow && (
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Open Now</span>
                    )}
                  </div>
                  {Array.isArray(openingHours?.weekdayDescriptions) && (
                    <div className="space-y-2">
                      {openingHours!.weekdayDescriptions!.map((day, index) => {
                        const [dayName, hours] = day.split(": ")
                        return (
                          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span className="text-sm md:text-base font-medium text-foreground">{dayName}</span>
                            <span className="text-sm md:text-base text-muted-foreground">{hours}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="inline-flex items-center gap-1 text-sm md:text-base text-pink-500 font-semibold hover:text-pink-600"
            >
              {showFullDescription ? (
                <>
                  Show Less <ChevronDown className="h-4 w-4 rotate-180" />
                </>
              ) : (
                <>
                  Read More <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
