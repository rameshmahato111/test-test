import type React from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Heading as Hiking,
  Utensils,
  Waves,
  Bed,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TourPackageCardProps {
  id: string;
  title: string;
  location: string;
  dateRange: string;
  duration: string;
  image: string;
  categories: string[];
  price: number;
  originalPrice: number;
  savings: number;
  credits: number;
  amenities: string[];
}

export function TourPackageCard({
  title,
  location,
  dateRange,
  duration,
  image,
  categories,
  price,
  originalPrice,
  savings,
  credits,
  amenities,
}: TourPackageCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Adventure: "bg-pink-100 text-pink-700 border-pink-200",
      Wellness: "bg-orange-100 text-orange-700 border-orange-200",
      Nightlife: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[category] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ReactNode> = {
      hiking: <Hiking className="h-5 w-5" />,
      food: <Utensils className="h-5 w-5" />,
      water: <Waves className="h-5 w-5" />,
      sports: <Dumbbell className="h-5 w-5" />,
      accommodation: <Bed className="h-5 w-5" />,
    };
    return icons[amenity] || null;
  };

  return (
    <div className="group relative h-[600px] overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-lg">
      <div className="absolute inset-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-md">
        <Clock className="h-3.5 w-3.5" />
        <span>{duration}</span>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white shadow-md hover:bg-white hover:scale-110 transition-transform"
      >
        <Heart className="h-5 w-5 text-gray-600" />
      </Button>

      <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-2xl font-bold text-gray-900">{title}</h3>

        <div className="mb-2 flex items-center gap-2 text-gray-700">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-gray-700">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{dateRange}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={`border ${getCategoryColor(category)}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="mb-4 border-t border-gray-200" />

        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs text-gray-600">Starting from (AUD)</p>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-pink-600">
                ${price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">Per person</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-pink-600">
                Save ${savings}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 text-gray-400">
              {amenities.map((amenity) => (
                <div key={amenity}>{getAmenityIcon(amenity)}</div>
              ))}
            </div>

            <div className="relative flex flex-col items-end">
              <Badge className="relative z-10 bg-pink-600 text-white hover:bg-pink-600 shadow-sm rounded-lg">
                Onbooking
              </Badge>
              <Badge
                variant="outline"
                className="relative -mt-1.5 pt-2.5 border-pink-600 text-pink-600 bg-white shadow-sm"
              >
                <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-lg bg-amber-400 text-[10px] font-bold text-white ">
                  ◉
                </span>
                {credits} Credits
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
