"use client"

import { TourPackageCard } from "./tour-package-card"

const tourPackages = [
  {
    id: "1",
    title: "Amazon Rainforest Expedition (Peru/Brazil)",
    location: "Peru, Brazil",
    dateRange: "28 Sept - 7 Oct",
    duration: "7 Days",
    image: "/images/city_landscape.jpg",
    categories: ["Adventure", "Wellness"],
    price: 252.55,
    originalPrice: 465.55,
    savings: 300,
    credits: 14,
    amenities: ["hiking", "food", "water", "sightseeing"],
  },
  {
    id: "2",
    title: "African Safari",
    location: "Kenya, Tanzania",
    dateRange: "28 Sept - 7 Oct",
    duration: "3 Days 2 Nights",
    image: "/images/city-1.png",
    categories: ["Adventure", "Nightlife", "Wellness"],
    price: 252.55,
    originalPrice: 465.55,
    savings: 300,
    credits: 14,
    amenities: ["hiking", "food", "water", "sightseeing", "transport"],
  },
  {
    id: "3",
    title: "Machu Picchu & Sacred Valley",
    location: "Peru",
    dateRange: "28 Sept - 7 Oct",
    duration: "7 Days",
    image: "/images/city-2.png",
    categories: ["Adventure"],
    price: 252.55,
    originalPrice: 465.55,
    savings: 300,
    credits: 14,
    amenities: ["hiking", "food", "water", "sightseeing"],
  },
  {
    id: "4",
    title: "Singapore & Sentosa Island",
    location: "Sydney, Australia",
    dateRange: "28 Sept - 7 Oct",
    duration: "4 Days",
    image: "/images/default-city.jpeg",
    categories: ["Adventure"],
    price: 252.55,
    originalPrice: 465.55,
    savings: 300,
    credits: 14,
    amenities: ["hiking", "food", "water", "transport"],
  },
  {
    id: "5",
    title: "Maldives Overwater Villa Stay",
    location: "Maldives",
    dateRange: "28 Sept - 7 Oct",
    duration: "2 Days",
    image: "/images/hero_bg.png",
    categories: ["Adventure"],
    price: 252.55,
    originalPrice: 465.55,
    savings: 300,
    credits: 14,
    amenities: ["hiking", "food", "water", "transport"],
  },
  {
    id: "6",
    title: "Bali Island Escape",
    location: "Indonesia",
    dateRange: "28 Sept - 7 Oct",
    duration: "2 Days 1 Night",
    image: "/images/city-2.png",
    categories: ["Adventure"],
    price: 252.55,
    originalPrice: 465.55,
    savings: 300,
    credits: 14,
    amenities: ["hiking", "food", "water", "transport"],
  },
]

export function TourPackagesSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold text-gray-900">Most Popular Tour Packages</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tourPackages.map((pkg) => (
          <TourPackageCard key={pkg.id} {...pkg} />
        ))}
      </div>
    </section>
  )
}
