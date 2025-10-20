import { type NextRequest, NextResponse } from "next/server"

interface TripRequest {
  starting_point: {
    latitude: number
    longitude: number
  }
  destination_point: {
    latitude: number
    longitude: number
  }
  starting_date: string
  ending_date: string
  budget: string
  travel_group_type: string
  mode_of_transport: string
  interests: string
  daily_drive_distance: string
  travelers_count?: number
  selected_location?: string
  selected_date?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TripRequest = await request.json()

    if (
      !body.starting_point?.latitude ||
      !body.starting_point?.longitude ||
      !body.destination_point?.latitude ||
      !body.destination_point?.longitude ||
      !body.starting_date ||
      !body.ending_date
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Making API call to exploreden with data:", body)

    const response = await fetch("https://api-v2.exploreden.com/itinify/generate/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API error response:", errorText)
      throw new Error(`API error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] API response data:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error calling backend API:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to generate itinerary: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
