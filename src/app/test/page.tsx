// import {
//   Car,
//   GripVertical,
//   MapPin,
//   Clock,
//   ParkingCircle,
//   Footprints,
//   EllipsisVertical,
//   Star,
//   ChevronRight,
//   Utensils,
//   Sparkles,
//   Trash2,
//   CircleAlertIcon,
//   Info,
// } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// const ItineraryCard = () => {
//   return (
//    <section className='mx-auto max-w-4xl p-6 text-slate-900'>
//      {/* Top meta row */}
//     <div className='mb-5 mx-auto w-[92%] max-w-xl flex items-center justify-between text-slate-600 px-1'>
//       <div className='inline-flex items-center gap-2 text-[15px]'>
//         <Car className='h-5 w-5' />
//         <span>
//           20 min (80 Km)
//         </span>
//       </div>
//       <Button className='text-[15px]'>Navigate</Button>
//     </div>



//     {/* Timeline and card */}
//     <div className='flex items-start gap-4'>
//       {/* Time label */}
//       <div className='hidden md:block min-w-[110px] pt-3 text-right text-slate-500'>
//         <span className='text-[18px] font-medium tracking-wide'>11:00 A.M.</span>
//       </div>

//       {/* Timeline dots */}
//       <div className='hidden md:flex self-stretch items-center text-slate-300'>
//         <GripVertical className='h-5 w-5' />
//       </div>

//       {/* Card */}
//       <div className='relative flex w-full flex-col md:flex-row items-stretch overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]'>
//         {/* Image side */}
//         <div className='relative w-full h-48 md:w-[150px] md:h-auto shrink-0 overflow-hidden self-stretch'>
//           <Image
//             src={'/images/food.jpeg'}
//             alt='food-image'
//             fill
//             className='object-cover w-full h-full'
//           />

//           {/* Pink circular badge top-left */}
//           <div className='absolute -left-1 -top-1 rounded-full border-4 border-white bg-pink-500 p-2 shadow-md'>
//             <Utensils className='h-4 w-4 text-white' />
//           </div>

//            {/* Rating pill bottom-left */}
//            <div className='absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[12px] font-medium shadow'>
//              <Star className='h-3.5 w-3.5 fill-pink-500 text-pink-500' />
//              <span>5.0</span>
//            </div>
//          </div>

//          {/* Right content */}
//         <div className='relative flex grow flex-col'>
//           {/* Desktop centered overflow menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
               
    
//                 className="hidden md:flex absolute right-2 top-12 -translate-y-1/2 p-1 rounded-full focus:outline-none cursor-pointer"
//               >
//                 <EllipsisVertical className='h-5 w-5 text-slate-400' />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               align="end"
//               sideOffset={8}
//               className="z-[9999] w-56 rounded-xl border border-slate-200/70 bg-white p-0 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
//             >
//               <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none">
//                 <Clock className="h-4 w-4 text-slate-600" />
//                 <span>Change Time</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
//               <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none">
//                 <Sparkles className="h-4 w-4 text-slate-600" />
//                 <span>Suggest Alternatives</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
//               <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-none">
//                 <Trash2 className="h-4 w-4 text-red-600" />
//                 <span>Remove</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <div className='flex items-start justify-between px-4 pt-4 md:px-6 md:pt-5'>
//             <div>
//               <h3 className='text-[18px] md:text-[20px] font-semibold text-slate-800'>
//                 Light Bavarian breakfast
//               </h3>
//               <div className='mt-1 inline-flex items-center gap-2 text-[13px] md:text-[14px] text-slate-500'>
//                 <MapPin className='h-4 w-4' />
//                 <span>Sydney Avenue Street</span>
//               </div>
//             </div>
//             {/* Mobile/Tablet top-right menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button className='md:hidden p-1 -m-1 rounded-full hover:bg-slate-100 border-none focus:outline-none cursor-pointer'>
//                   <EllipsisVertical className='h-5 w-5 text-slate-400' />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 align='end'
//                 sideOffset={6}
//                 className='z-[9999] w-56 rounded-xl border border-slate-200/70 bg-white p-0 shadow-[0_10px_24px_rgba(0,0,0,0.12)]'
//               >
//                 <DropdownMenuItem className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none'>
//                   <Clock className='h-4 w-4 text-slate-600' />
//                   <span>Change Time</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
//                 <DropdownMenuItem className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50 rounded-none'>
//                   <Sparkles className='h-4 w-4 text-slate-600' />
//                   <span>Suggest Alternatives</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator className='bg-slate-200/70 my-0 mx-0' />
//                 <DropdownMenuItem className='flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-none'>
//                   <Trash2 className='h-4 w-4 text-red-600' />
//                   <span>Remove</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className='mt-3 md:mt-4 border-t border-slate-200' />

//           {/* Rows */}
//           <div className='space-y-3 px-4 py-3 md:px-6 md:py-4 text-[13px] md:text-[14px]'>
//             <div className='flex items-center justify-between'>
//               <div className='inline-flex items-center gap-2 text-slate-700'>
//                 <Clock className='h-4 w-4 text-slate-500' />
//                 <span className='font-medium'>11–12:45</span>
//                 <span className='text-slate-400'>(1hr 45min)</span>
//               </div>
//             </div>

//             <div className='border-t border-slate-200' />

//             <div className='flex items-center justify-between'>
//               <div className='inline-flex items-center gap-2 text-slate-700'>
//                 <ParkingCircle className='h-4 w-4 text-slate-500' />
//                 <span>
//                   <span className='font-medium'>Purple</span>
//                   <span className='mx-1'>Express</span>
//                   <span className='text-slate-400'>($4.50/hr)</span>
//                 </span>
//               </div>
//               <button className='text-[12px] md:text-[13px] font-medium text-slate-700 underline'>Change</button>
//             </div>

//             <div className='border-t border-slate-200' />

//             <div className='flex items-center justify-between'>
//               <div className='inline-flex items-center gap-2 text-slate-700'>
//                 <Footprints className='h-4 w-4 text-slate-500' />
//                 <span className='font-medium'>2 min</span>
//                 <span className='text-slate-400'>(10 m)</span>
//               </div>
//             </div>
//           </div>

//           <div className='mt-auto w-full rounded-b-2xl bg-pink-50 px-4 py-3 md:px-6 text-[15px] text-pink-600'>
//             <button className='inline-flex items-center gap-3 font-medium'>
//                 <Info className='h-5 w-5' />
//               <span>View Details</span>
              
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//    </section>
//   )
// }

// export default ItineraryCard


// // import RecommendationItineraryPlaces from '@/components/Itinerary/travel-preference/recommendation-itinerary-places'
// // import React from 'react'

// // const page = () => {
// //   return (
// //    <RecommendationItineraryPlaces/>
// //   )
// // }

// // export default page


// "use client"

// import type React from "react"

// import { useState } from "react"

// import { MapPin } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import MapItineraryDetails from "@/components/Itinerary/travel-preference/map-itinerary-details"

// export default function Home() {
//   const [showModal, setShowModal] = useState(false)
//   const [triggerPosition, setTriggerPosition] = useState<{ x: number; y: number } | undefined>(undefined)

//   const handleMarkerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     const rect = event.currentTarget.getBoundingClientRect()
//     setTriggerPosition({
//       x: rect.left + rect.width / 2,
//       y: rect.top + rect.height / 2,
//     })
//     setShowModal(true)
//   }

//   return (
//     <div className="min-h-screen bg-[#c8e6d0] relative overflow-y-scroll">
//       {/* Map background pattern - decorative */}
      

//       <div className="relative z-10">
//         {/* Top-left marker */}
//         <button
//           onClick={handleMarkerClick}
//           className="absolute top-20 left-10 sm:left-20 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
//           aria-label="Restaurant marker - top left"
//         >
//           <MapPin className="w-6 h-6" />
//         </button>

//         {/* Top-right marker */}
//         <button
//           onClick={handleMarkerClick}
//           className="absolute top-20 right-10 sm:right-20 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
//           aria-label="Restaurant marker - top right"
//         >
//           <MapPin className="w-6 h-6" />
//         </button>

//         {/* Center marker */}
//         <button
//           onClick={handleMarkerClick}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
//           aria-label="Restaurant marker - center"
//         >
//           <MapPin className="w-6 h-6" />
//         </button>

//         {/* Bottom-left marker */}
//         <button
//           onClick={handleMarkerClick}
//           className="absolute bottom-20 left-10 sm:left-20 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
//           aria-label="Restaurant marker - bottom left"
//         >
//           <MapPin className="w-6 h-6" />
//         </button>

//         {/* Bottom-right marker */}
//         <button
//           onClick={handleMarkerClick}
//           className="absolute bottom-20 right-10 sm:right-20 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
//           aria-label="Restaurant marker - bottom right"
//         >
//           <MapPin className="w-6 h-6" />
//         </button>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
//           <MapItineraryDetails triggerPosition={triggerPosition} onClose={() => setShowModal(false)} />
//         </div>
//       )}
//     </div>
    
   
//   )
// }



import CitiesSection from "@/components/City/CitiesSection";
import BlogSection from "@/components/home_page/BlogSection";
import { FeaturesSection } from "@/components/HomeSection/features-section";
import FooterHeroSectionHomePage from "@/components/HomeSection/footer-hero-section";
import { HeroSection } from "@/components/HomeSection/hero-section";
import { MasonryGrid } from "@/components/HomeSection/masonry-grid";
import PopularCities from "@/components/HomeSection/popular-city-section";
import PopularItineraries from "@/components/HomeSection/popular-itinerary";
import { SearchSection } from "@/components/HomeSection/search-section";
import SecondFooterHeroSection from "@/components/HomeSection/second-footer-hero-section";
import { TopDealsSection } from "@/components/HomeSection/top-deal-section";
import { TourPackagesSection } from "@/components/HomeSection/tour-package-section";
import { POPULAR_CITIES_SECTION_SEE_ALL_URL, POPULAR_CITIES_SECTION_TITLE } from "@/data/staticData";


export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <TopDealsSection />
      <TourPackagesSection/>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          Hear what our customers say
        </h1>
        <MasonryGrid />
      </div>
       <CitiesSection title={POPULAR_CITIES_SECTION_TITLE} seeAllUrl={POPULAR_CITIES_SECTION_SEE_ALL_URL} />
      <FooterHeroSectionHomePage/>
      <PopularItineraries/>
      <SecondFooterHeroSection/>
      <BlogSection/>
    </main>
  )
}
