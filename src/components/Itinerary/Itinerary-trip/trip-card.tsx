import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Calendar, EllipsisVertical, Edit2, CloudUpload, Share2, Download, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TripCardProps {
  id: string
  title: string
  location: string
  startDate: string
  endDate: string
  price: string
  rating: number
  image: string
  isFavorite?: boolean
  className?: string
  badgeLabel?: string
  tags?: string[]
  onEdit?: (id: string) => void
  onPublish?: (id: string) => void
  onShare?: (id: string) => void
  onDownload?: (id: string) => void
  onDelete?: (id: string) => void
}

export function TripCard({
  id,
  title,
  location,
  startDate,
  endDate,
  price,
  rating,
  image,
  isFavorite = false,
  className,
  badgeLabel = "City Trip",
  tags = ["Adventure", "NightLife", "Wellness"],
  onEdit,
  onPublish,
  onShare,
  onDownload,
  onDelete,
}: TripCardProps) {
  const tagClass = (tag: string) => {
    const t = tag.toLowerCase()
    if (t.includes("adventure")) return "bg-pink-50 text-pink-600 border border-pink-200"
    if (t.includes("night")) return "bg-violet-50 text-violet-600 border border-violet-200"
    if (t.includes("wellness") || t.includes("health")) return "bg-amber-50 text-amber-600 border border-amber-200"
    return "bg-gray-50 text-gray-600 border border-gray-200"
  }

  return (
    <Card className={cn(
      "relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded-t-2xl" />
        {/* Top-left badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium rounded-md bg-white text-blue-600 shadow-sm">
            {badgeLabel}
          </span>
        </div>
        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-8 h-8"
        >
          <Heart className={cn("w-4 h-4", isFavorite ? "fill-red-500 text-red-500" : "text-gray-700")} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            {title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6 -mt-1">
                <EllipsisVertical className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 w-44 rounded-2xl shadow-lg border border-gray-200 bg-white p-0 overflow-hidden">
              <DropdownMenuItem onClick={() => onEdit?.(id)} className="gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700">
                <Edit2 className="w-4 h-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPublish?.(id)} className="gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700 border-t">
                <CloudUpload className="w-4 h-4" /> Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(id)} className="gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700 border-t">
                <Share2 className="w-4 h-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload?.(id)} className="gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-900 font-semibold border-t">
                <Download className="w-4 h-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(id)} className="gap-2 cursor-pointer px-4 py-2 text-red-600 hover:bg-red-50 border-t">
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            {startDate} - {endDate}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className={cn("px-3 py-1 text-xs rounded-full", tagClass(tag))}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
