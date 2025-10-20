"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export interface CostItem {
  id: number
  day: string
  activities: number
  hotel: number
  other: number
}

const initialData: CostItem[] = []

const chartData = [
  { name: "Activities", value: 20, color: "#ec4899" },
  { name: "Hotel", value: 40, color: "#3b82f6" },
]

export function CostSummary({ items, currency }: { items?: CostItem[]; currency?: string }) {
  const [costItems, setCostItems] = useState<CostItem[]>(items && items.length ? items : initialData)

  useEffect(() => {
    if (items && Array.isArray(items)) setCostItems(items)
  }, [items])

  const subtotal = costItems.reduce((sum, item) => sum + item.activities + item.hotel + item.other, 0)
  const discount = 0
  const total = subtotal - discount
  const currencyLabel = currency ? `${currency} ` : "$"

  const addNewDay = () => {
    const newDay = costItems.length + 1
    setCostItems([
      ...costItems,
      {
        id: Date.now(),
        day: `Day ${newDay}`,
        activities: 123,
        hotel: 123,
        other: 0,
      },
    ])
  }

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">Estimated Cost (USD) per person</h2>

      {/* Desktop/Tablet: original table layout (md and up) */}
      <div className="hidden md:block space-y-4">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Day</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Activities</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Hotel</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">|</th>
              </tr>
            </thead>
            <tbody>
              {costItems.map((item, index) => (
                <tr key={item.id} className={`border-b border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{item.day}</td>
                  <td className="px-4 py-3 text-center text-sm text-foreground">{currencyLabel}{item.activities.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-foreground">{currencyLabel}{item.hotel.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-muted-foreground">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addNewDay}
          className="inline-flex items-center text-pink-500 hover:text-pink-600 text-base"
        >
          <Plus className="w-4 h-4 mr-2" /> Add new
        </button>
      </div>

      {/* Mobile-only stacked cards for each day */}
      <div className="md:hidden space-y-4">
        {costItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base text-foreground">{item.day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 border-t mt-2 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Activities</span>
                  <span className="text-gray-900 font-medium">{currencyLabel}{item.activities.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Hotel</span>
                  <span className="text-gray-900 font-medium">{currencyLabel}{item.hotel.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">&nbsp;</span>
                  <span className="text-gray-400">-</span>
                </div>
              </CardContent>
            </Card>
            <button
              type="button"
              onClick={addNewDay}
              className="inline-flex items-center text-pink-500 hover:text-pink-600 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add new
            </button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-gray-700">Subtotal</span>
          <span className="text-sm sm:text-base font-medium text-gray-900">{currencyLabel}{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base text-gray-700">Discount (10%)</span>
          <span className="text-sm sm:text-base font-medium text-gray-900">{currencyLabel}{discount.toLocaleString()}</span>
        </div>
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-base sm:text-lg font-semibold text-gray-900">Total</span>
          <span className="text-base sm:text-lg font-semibold text-gray-900">{currencyLabel}{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Summary section with pie chart */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Summary</h3>
        <Card className="p-4">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={0} outerRadius={56} paddingAngle={2} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm sm:text-base text-foreground">{item.name}</span>
                  <span className="text-sm sm:text-base font-medium text-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
