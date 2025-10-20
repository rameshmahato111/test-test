import { Heart, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export interface Deal {
  id: string
  title: string
  image: string
  rating: number
  location: string
  originalPrice: number
  discountedPrice: number
  discount: number
  credits: number
  onbooking: boolean
}

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <div className="group relative flex-shrink-0 w-[320px] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-[240px] overflow-hidden">
        <Image
          src={deal.image || "/placeholder.svg"}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white"
        >
          <Heart className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Discount Badge */}
        <Badge className="absolute bottom-3 left-3 bg-pink-500 hover:bg-pink-600 text-white border-0">
          <span className="mr-1">%</span>
          {deal.discount}% Discount
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{deal.title}</h3>

        {/* Rating and Location */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700">{deal.rating}</span>
          </div>
          <span className="text-gray-400">·</span>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{deal.location}</span>
          </div>
        </div>

        {/* Price and Badges */}
        <div className="flex items-end justify-between">
          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-500">AUD</span>
            <span className="text-2xl font-bold text-pink-500">${deal.discountedPrice.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
          </div>

          <div className="flex flex-col items-end">
            {deal.onbooking && (
              <Badge
                variant="secondary"
                className="bg-pink-500 text-white hover:bg-pink-600 border-0 px-3 py-1 relative z-10 shadow-sm rounded-lg"
              >
                Onbooking
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-white text-pink-500 hover:bg-gray-50 border border-pink-200 px-2.5 py-1 -mt-1.5 pt-2.5 rounded-lg"
            >
               <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-lg bg-amber-400 text-[10px] font-bold text-white ">
                  ◉
                </span>
              {deal.credits} Credits
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
