"use client"

import {
  Car,
  GripVertical,
  MapPin,
  Clock,
  ParkingCircle,
  Footprints,
  EllipsisVertical,
  Star,
  ChevronRight,
  Utensils,
  Sparkles,
  Trash2,
  CircleAlertIcon,
  Info,
  Ticket,
  BadgeDollarSign,
} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
type ItineraryCardProps = {
  travelMeta: string
  timeLabel: string
  imageSrc: string
  title: string
  address: string
  durationText: string
  priceText?: string
  rating?: number
  ctaKind?: 'ticket' | 'details'
  onNavigate: () => void
  onCta: () => void
  onSuggestAlternative?: () => void
  // New: coordinates of this card's location for parking search
  latitude: number
  longitude: number
  // New: when user clicks "view" in Parking, show it on the map
  onViewParking: (params: { latitude: number; longitude: number; name: string }) => void
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  travelMeta,
  timeLabel,
  imageSrc,
  title,
  address,
  durationText,
  priceText,
  rating = 5,
  ctaKind = 'details',
  onNavigate,
  onCta,
  onSuggestAlternative,
  latitude,
  longitude,
  onViewParking,
}) => {
  const [parking, setParking] = React.useState<{
    name: string
    address: string
    distance_meters: number
    distance_display: string
    latitude: number
    longitude: number
    price_display?: string | null
    is_free?: boolean
    available?: boolean
  } | null>(null)
  const [parkingLoading, setParkingLoading] = React.useState(false)
  const [parkingError, setParkingError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let aborted = false
    const fetchParking = async () => {
      try {
        setParkingLoading(true)
        setParkingError(null)
        const url = `https://api-v2.exploreden.com/itinify/parking/free-search/?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`parking api ${res.status}`)
        const json = await res.json()
        const data = json?.data
        if (!data) throw new Error('invalid parking payload')
        // Prefer free; else best paid; else first of all options
        let pick: any = null
        if (Array.isArray(data.free_parking_options) && data.free_parking_options.length > 0) {
          pick = data.free_parking_options[0]
        } else if (data?.summary?.best_paid_option) {
          pick = data.summary.best_paid_option
        } else if (Array.isArray(data.paid_parking_options) && data.paid_parking_options.length > 0) {
          pick = data.paid_parking_options[0]
        } else if (Array.isArray(data.all_parking_options) && data.all_parking_options.length > 0) {
          pick = data.all_parking_options[0]
        }
        if (!aborted && pick?.location) {
          setParking({
            name: pick.name || pick.location_display || 'Parking',
            address: pick.address || '',
            distance_meters: Number(pick.distance_meters) || 0,
            distance_display: pick.distance_display || '',
            latitude: Number(pick.location.latitude),
            longitude: Number(pick.location.longitude),
            price_display: pick.price_display ?? null,
            is_free: !!pick.is_free,
            available: pick.available === true,
          })
        }
      } catch (e: any) {
        if (!aborted) setParkingError(e?.message || 'Failed to fetch parking')
      } finally {
        if (!aborted) setParkingLoading(false)
      }
    }
    // Fetch once per card when lat/lng present
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      fetchParking()
    }
    return () => { aborted = true }
  }, [latitude, longitude])

  const walkingText = React.useMemo(() => {
    if (!parking) return { time: '', dist: '' }
    const m = parking.distance_meters || 0
    const minutes = Math.max(1, Math.ceil(m / 80)) // ~5km/h
    return { time: `${minutes} min`, dist: `(${parking.distance_display || `${m.toFixed(0)}m`})` }
  }, [parking])

  return (
   <div className='w-full p-0 text-slate-900'>
     {/* Timeline and card */}
    <div className='flex items-start gap-3'>
      {/* Time label */}
      <div className='hidden md:block min-w-[96px] pt-3 text-right text-slate-500 mt-16'>
        <span className='text-[14px]  font-medium tracking-wide'>{timeLabel}</span>
      </div>

      {/* Timeline dots */}
      <div className='hidden md:flex self-stretch items-center text-slate-300'>
        <GripVertical className='h-5 w-5' />
      </div>

      {/* Right column containing meta + card */}
      <div className='flex-1'>
        {/* Meta row above card, aligned with card width */}
        <div className='mb-2 flex items-center justify-between text-slate-600 pr-1'>
          <div className='inline-flex items-center gap-2 text-[15px]'>
            <Car className='h-5 w-5' />
            <span>{travelMeta}</span>
          </div>
          <Button className='text-[15px]' onClick={onNavigate}>Navigate</Button>
        </div>

        {/* Card */}
        <div className='relative -ml-1 md:-ml-2 flex w-full flex-col md:flex-row items-stretch overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]'>
        {/* Image side */}
        <div className='relative w-full h-48 md:w-[150px] md:h-auto shrink-0 overflow-hidden self-stretch'>
          <Image
            src={imageSrc}
            alt='card-image'
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 150px'
            loading='lazy'
            decoding='async'
            quality={70}
          />

          {/* Pink circular badge top-left */}
          <div className='absolute -left-1 -top-1 rounded-full border-4 border-white bg-pink-500 p-2 shadow-md'>
            <Utensils className='h-4 w-4 text-white' />
          </div>

           {/* Rating pill bottom-left */}
           <div className='absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[12px] font-medium shadow'>
             <Star className='h-3.5 w-3.5 fill-pink-500 text-pink-500' />
             <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
           </div>
         </div>

         {/* Right content */}
        <div className='relative flex grow flex-col'>
          {/* Desktop centered overflow menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
               
    
                className="hidden md:flex absolute right-2 top-12 -translate-y-1/2 p-1 rounded-full focus:outline-none cursor-pointer"
              >
                <EllipsisVertical className='h-5 w-5 text-slate-400' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="z-[9999] w-56 rounded-xl border border-slate-200/70 bg-white p-0 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
            >
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none">
                <Clock className="h-4 w-4 text-slate-600" />
                <span>Change Time</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onSuggestAlternative && onSuggestAlternative(); }} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none">
                <Sparkles className="h-4 w-4 text-slate-600" />
                <span>Suggest Alternatives</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-none">
                <Trash2 className="h-4 w-4 text-red-600" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className='flex items-start justify-between px-4 pt-4 md:px-6 md:pt-5'>
            <div>
              <h3 className='text-[18px] font-semibold text-slate-800'>
                {title}
              </h3>
              <div className='mt-1 inline-flex items-center gap-2 text-[13px] md:text-[14px] text-slate-500'>
                <MapPin className='h-4 w-4' />
                <span>{address}</span>
              </div>
            </div>
            {/* Mobile/Tablet top-right menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='md:hidden p-1 -m-1 rounded-full hover:bg-slate-100 border-none focus:outline-none cursor-pointer'>
                  <EllipsisVertical className='h-5 w-5 text-slate-400' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                sideOffset={6}
                className='z-[9999] w-56 rounded-xl border border-slate-200/70 bg-white p-0 shadow-[0_10px_24px_rgba(0,0,0,0.12)]'
              >
                <DropdownMenuItem className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none'>
                  <Clock className='h-4 w-4 text-slate-600' />
                  <span>Change Time</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onSuggestAlternative && onSuggestAlternative(); }} className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none'>
                  <Sparkles className='h-4 w-4 text-slate-600' />
                  <span>Suggest Alternatives</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
                <DropdownMenuItem className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-none'>
                  <Trash2 className='h-4 w-4 text-red-600' />
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='mt-3 md:mt-4 border-t border-slate-200' />

          {/* Rows */}
          <div className='space-y-3 px-4 py-3 md:px-6 md:py-4 text-[13px] md:text-[14px]'>
            {/* Duration and price */}
            {durationText && (
             <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2 text-slate-700'>
                <Clock className='h-4 w-4 text-slate-500' />
                <span className='font-medium'>{durationText}</span>
                
              </div>
            </div>
            )}
            
            
            {priceText && <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2 text-slate-700'>
                <BadgeDollarSign className='h-4 w-4 text-slate-500' />
                <span className='font-medium'>{priceText}</span>
                
              </div>
            </div> }

            <div className='border-t border-slate-200' />

            {/* Parking */}
            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2 text-slate-700'>
                <ParkingCircle className='h-4 w-4 text-slate-500' />
                {parkingLoading ? (
                  <span className='text-slate-400'>Finding parking…</span>
                ) : parking && parking.available ? (
                  <span className='font-medium'>Parking available</span>
                ) : parkingError ? (
                  <span className='text-slate-400'>No parking found</span>
                ) : (
                  <span className='text-slate-400'>No parking</span>
                )}
              </div>
              <button
                className='text-[12px] md:text-[13px] font-medium text-slate-700 underline disabled:text-slate-300'
                disabled={!parking || !parking.available}
                onClick={() => {
                  if (parking && parking.available) onViewParking({ latitude: parking.latitude, longitude: parking.longitude, name: 'Parking' })
                }}
              >
                view
              </button>
            </div>

            <div className='border-t border-slate-200' />

            {/* Walking */}
            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2 text-slate-700'>
                <Footprints className='h-4 w-4 text-slate-500' />
                {parking && parking.available ? (
                  <>
                    <span className='font-medium'>{walkingText.time}</span>
                    <span className='text-slate-400'>{walkingText.dist}</span>
                  </>
                ) : (
                  <span className='text-slate-400'>—</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className='mt-auto w-full rounded-b-2xl bg-pink-50 px-4 py-3 md:px-6 text-[15px] text-pink-600'>
            <button className='inline-flex items-center gap-3 font-medium' onClick={onCta}>
              {ctaKind === 'ticket' ? (
                <>
                  <Ticket className='h-5 w-5' />
                  <span>Buy Ticket</span>
                </>
              ) : (
                <>
                  <Info className='h-5 w-5' />
                  <span>View Details</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default ItineraryCard