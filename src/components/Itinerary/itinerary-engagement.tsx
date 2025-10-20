"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type Range = "7d" | "14d" | "30d"

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return `${n}`
}

export default function ItineraryEngagement() {
  const [range, setRange] = useState<Range>("7d")

  const data = useMemo(() => {
    const base = [
      { day: "Aug 19", hotel: 2.6, activities: 2.2 },
      { day: "Aug 20", hotel: 2.7, activities: 2.1 },
      { day: "Aug 21", hotel: 3.9, activities: 0 },
      { day: "Aug 22", hotel: 2.6, activities: 0 },
      { day: "Aug 23", hotel: 0, activities: 2.2 },
      { day: "Aug 24", hotel: 3.9, activities: 3.6 },
    ]
    if (range === "14d") return [...base, ...base]
    if (range === "30d") return [...base, ...base, ...base, ...base]
    return base
  }, [range])

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Top metrics */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="p-3 sm:p-4 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500">Views</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-xl sm:text-2xl font-bold">12,789</div>
            <div className="text-[10px] sm:text-xs text-green-600">▲ 12%</div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500">Bookings</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-xl sm:text-2xl font-bold">4</div>
            <div className="text-[10px] sm:text-xs text-red-500">▼ 11%</div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500">Shares</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-xl sm:text-2xl font-bold">12,789</div>
            <div className="text-[10px] sm:text-xs text-green-600">▲ 22%</div>
          </div>
        </Card>
      </div>

      {/* Chart card */}
      <Card className="p-3 sm:p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-base sm:text-lg font-semibold">Credits Earned</div>
          <Button variant="outline" className="h-8 sm:h-9 gap-1 px-2 sm:px-3 rounded-lg">
            <span className="text-xs sm:text-sm">Last 7 Days</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-3 sm:mt-5 h-56 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}k`}
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} formatter={(v: any) => `${v}k`} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="hotel" name="Hotel" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={22} />
              <Bar dataKey="activities" name="Activities" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
