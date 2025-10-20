// "use client"

// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"
// import type { TripData } from "@/app/itinerary/page"

// interface ItineraryStepThreeProps {
//   tripData: TripData
//   updateTripData: (data: Partial<TripData>) => void
//   onGenerate: () => void
//   onBack: () => void
//   isLoading: boolean
//   validationErrors: string[]
// }

// const interestOptions = [
//   { value: "Adventure", label: "Adventure", icon: "🏔️", color: "bg-blue-100" },
//   { value: "Sports Adventure", label: "Sports Adventure", icon: "⚽", color: "bg-green-100" },
//   { value: "Foods and Drinks", label: "Food & Drinks", icon: "🍔", color: "bg-purple-100" },
//   { value: "Wellness and Relaxation", label: "Wellness & Relaxation", icon: "🌸", color: "bg-orange-100" },
//   { value: "Cultural and Creative", label: "Cultural & Creative", icon: "🎭", color: "bg-cyan-100" },
//   { value: "Local Experience", label: "Local Experience", icon: "📍", color: "bg-orange-100" },
//   { value: "Family Fun", label: "Family Fun", icon: "👨‍👩‍👧‍👦", color: "bg-teal-100" },
//   { value: "Nature Wildlife", label: "Nature Wildlife", icon: "🐾", color: "bg-red-100" },
// ]

// const budgetOptions = [
//   { value: "economic", label: "Economic", price: "$500-$1000", icon: "💰" },
//   { value: "standard", label: "Standard", price: "$2500-$5000", icon: "📋" },
//   { value: "luxury", label: "Luxury", price: "$5000+", icon: "💎" },
// ]

// export function ItineraryStepThree({ tripData, updateTripData, onGenerate, onBack, isLoading, validationErrors }: ItineraryStepThreeProps) {
//   return (
//     <div className="space-y-8">
//       {/* Interests Section */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-medium text-gray-900">What excites you (Select your Interests)</h3>
//         <div className="grid grid-cols-4 gap-4">
//           {interestOptions.map((option) => (
//             <button
//               key={option.value}
//               onClick={() => updateTripData({ interests: option.value })}
//               className={`p-4 rounded-lg border-2 transition-all text-center ${
//                 tripData.interests === option.value 
//                   ? "border-pink-500 bg-pink-50" 
//                   : "border-gray-200 hover:border-pink-300"
//               }`}
//             >
//               <div className="text-2xl mb-2">{option.icon}</div>
//               <div className="text-sm font-medium">{option.label}</div>
//             </button>
//           ))}
//         </div>
//         <div className="text-start">
//           <button className="text-gray-600 underline hover:text-gray-800">See all</button>
//         </div>
//       </div>

//       {/* Budget Section */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-medium text-gray-900">Select your Budget</h3>
//         <div className="grid grid-cols-4 gap-4">
//           {budgetOptions.map((option) => (
//             <button
//               key={option.value}
//               onClick={() => updateTripData({ budget: option.value })}
//               className={`p-4 rounded-lg border-2 transition-all text-center ${
//                 tripData.budget === option.value 
//                   ? "border-pink-500 bg-pink-50" 
//                   : "border-gray-200 hover:border-pink-300"
//               }`}
//             >
//               <div className="text-2xl mb-2">{option.icon}</div>
//               <div className="font-medium mb-1">{option.label}</div>
//               <div className="text-sm text-gray-600">{option.price}</div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Validation Errors */}
//       {validationErrors.length > 0 && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//           <ul className="text-red-700 text-sm space-y-1">
//             {validationErrors.map((error, index) => (
//               <li key={index}>• {error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Navigation Buttons */}
//       <div className="flex justify-between">
//         <Button 
//           variant="outline" 
//           onClick={onBack}
//           className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-lg"
//         >
//           Back
//         </Button>
        
//         <Button 
//           onClick={onGenerate} 
//           disabled={isLoading}
//           className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg"
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               Generating...
//             </>
//           ) : (
//             "Plan my Itinerary"
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }
