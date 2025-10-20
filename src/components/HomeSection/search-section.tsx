"use client"

import { useState } from "react"
import { Search, Calendar, Users, Building2, Package, Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TabType = "hotel" | "tour" | "activities"

export function SearchSection() {
  const [activeTab, setActiveTab] = useState<TabType>("hotel")

  return (
    <div className="relative z-20 mx-auto -mt-24 w-full max-w-7xl px-4">
      <div className="rounded-2xl bg-white p-6 shadow-2xl">
        {/* Tabs */}
        <div className="mb-6 flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("hotel")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-base font-medium transition-colors ${
              activeTab === "hotel"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="h-5 w-5" />
            Hotel
          </button>
          <button
            onClick={() => setActiveTab("tour")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-base font-medium transition-colors ${
              activeTab === "tour"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Package className="h-5 w-5" />
            Tour Packages
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-base font-medium transition-colors ${
              activeTab === "activities"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Grid3x3 className="h-5 w-5" />
            Activities
          </button>
        </div>

        {/* Search Form */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Location or Hotel Name"
              className="h-14 rounded-xl border-gray-200 pl-12 text-base"
            />
          </div>
          <div className="relative flex-1">
            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Check In - Check Out"
              className="h-14 rounded-xl border-gray-200 pl-12 text-base"
            />
          </div>
          <div className="relative flex-1">
            <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Room and People"
              className="h-14 rounded-xl border-gray-200 pl-12 text-base"
            />
          </div>
          <Button className="h-14 rounded-xl bg-pink-500 px-12 text-base font-semibold text-white hover:bg-pink-600">
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
