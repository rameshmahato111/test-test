"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  startDate?: Date
  endDate?: Date
  onDateChange?: (range: DateRange | undefined) => void
  placeholder?: string
}

export function DateRangePicker({
  className,
  startDate,
  endDate,
  onDateChange,
  placeholder = "Pick a date range"
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  })

  React.useEffect(() => {
    if (startDate || endDate) {
      setDate({
        from: startDate,
        to: endDate,
      })
    }
  }, [startDate, endDate])

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range)
    onDateChange?.(range)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            className="rounded-md border-0"
          />
          <div className="flex items-center justify-between p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDate(undefined)
                onDateChange?.(undefined)
              }}
              className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                // Close popover logic would go here
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
