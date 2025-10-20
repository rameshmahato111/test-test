"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Building2,
  Star,
  Users,
  MoreHorizontal,
  Download,
  Share2,
  Send,
  Trash2,
  Edit2,
  EllipsisVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import React from "react"

export type PublishedItem = {
  id: string
  title: string
  city: string
  country: string
  cityType: string
  days: number
  nights: number
  image: string
  categories: string[]
  price: string
  rating: string
  likes: string
}

interface Props {
  item: PublishedItem
}

export function PublishedCard({ item }: Props) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md border rounded-xl transition-colors duration-200 hover:bg-gray-50">
      <div className="relative h-40 md:h-44 w-full">
        <Image src={item.image} alt={item.title} fill className="object-cover" />
        <div className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-700 shadow">
          {item.days} Days {item.nights > 0 ? ` ${item.nights} Nights` : ""}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full shrink-0">
                <EllipsisVertical className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 z-50 bg-white rounded-xl shadow-lg border p-0 overflow-hidden"
            >
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100 py-2.5 border-t border-gray-200 first:border-t-0">
                <Edit2 className="h-4 w-4 mr-2 text-gray-500" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100 py-2.5 border-t border-gray-200 first:border-t-0">
                <Send className="h-4 w-4 mr-2 text-gray-500" /> Publish
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100 py-2.5 border-t border-gray-200 first:border-t-0">
                <Share2 className="h-4 w-4 mr-2 text-gray-500" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100 py-2.5 border-t border-gray-200 first:border-t-0">
                <Download className="h-4 w-4 mr-2 text-gray-500" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 hover:bg-red-50 focus:bg-red-50 py-2.5 border-t border-gray-200 first:border-t-0">
                <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {item.city}, {item.country}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> {item.cityType}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" /> {item.rating}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {item.likes}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.categories.map((c) => (
            <Badge key={c} variant="secondary" className="rounded-full bg-pink-50 text-pink-600 border-0 text-[11px] py-1 px-2">
              {c}
            </Badge>
          ))}
        </div>

        <div className="mt-4 text-[11px] text-gray-500">Starting from (AUD)</div>
        <div className="text-pink-600 font-semibold">{item.price}</div>
      </div>
    </Card>
  )
}
