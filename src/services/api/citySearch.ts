export interface CitySearchResult {
  id: string
  name: string
  country: string
  coordinates: {
    latitude: number
    longitude: number
  }
  display_name?: string
}

export interface CitySearchResponse {
  results: CitySearchResult[]
  total: number
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const response = await fetch(
      `https://api-v2.exploreden.com/core/display-cities/search_cities/?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`City search failed: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the API response to match our interface
    return data.results?.map((city: any) => ({
      id: city.id?.toString() || city.name,
      name: city.name,
      country: city.country_name || city.country || '',
      coordinates: {
        latitude: city.coordinates?.[0] || city.latitude || 0,
        longitude: city.coordinates?.[1] || city.longitude || 0,
      },
      display_name: `${city.name}, ${city.country_name || city.country || ''}`.trim()
    })) || []
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}
