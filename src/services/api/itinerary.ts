import { handleResponse } from "./client";

const API_BASE_URL = "https://api-v2.exploreden.com";

export interface EnrichDayResponse {
  success: boolean;
  data: {
    message: string;
    daily_driving_distance: number;
    duration_hours: number;
    checkpoints: Array<{
      index: number;
      time: string;
      coordinate: [number, number];
      distance_from_start_km: number;
      activity: string;
      q: string;
      duration: string;
      is_driving: boolean;
      is_final_destination: boolean;
      date: string;
      day: number;
      day_label: string;
      activities?: Array<{
        displayName: string;
        formattedAddress: string;
        description: string;
        location: {
          latitude: number;
          longitude: number;
        };
        rating: number;
        priceLevel: string | null;
        types: string[];
        websiteUri: string;
        googleMapsUri: string;
        primaryType: string;
        openingHours: {
          openNow: boolean;
          weekdayDescriptions: string[];
          nextOpenTime: string | null;
        };
        parkingOptions: {
          freeParkingLot: boolean;
          freeStreetParking: boolean;
        } | null;
        photos: {
          name: string;
          widthPx: number;
          heightPx: number;
        };
        pricingRange: {
          startPrice: {
            currencyCode: string;
            units: string;
          };
          endPrice: {
            currencyCode: string;
            units: string;
          };
        } | null;
        source: string;
      }>;
      restaurants?: Array<{
        displayName: string;
        formattedAddress: string;
        description: string;
        location: {
          latitude: number;
          longitude: number;
        };
        rating: number;
        priceLevel: string | null;
        types: string[];
        websiteUri: string;
        googleMapsUri: string;
        primaryType: string;
        openingHours: {
          openNow: boolean;
          weekdayDescriptions: string[];
          nextOpenTime: string | null;
        };
        parkingOptions: {
          freeParkingLot: boolean;
          freeStreetParking: boolean;
        } | null;
        photos: {
          name: string;
          widthPx: number;
          heightPx: number;
        };
        pricingRange: {
          startPrice: {
            currencyCode: string;
            units: string;
          };
          endPrice: {
            currencyCode: string;
            units: string;
          };
        } | null;
        source: string;
      }>;
      hotels?: Array<{
        id: string;
        name: string;
        description: string;
        image: string;
        type: string;
        supplier: string;
        city: string;
        location: {
          latitude: number;
          longitude: number;
        };
        minPrice: string;
        originalPrice: string;
        farePrice: string;
        currency: string;
      }>;
      categories?: any[];
      information?: string;
      activities_date?: string;
      restaurants_date?: string;
      hotel_dates?: {
        check_in: string;
        check_out: string;
      };
      city_info?: {
        name: string;
        coordinates: [number, number];
        place_type: string;
      };
      hotel_area_suggestions?: {
        attractions: any[];
        nightlife: any[];
        restaurants: any[];
        categories: any[];
        information: string;
      };
    }>;
    parts_per_day: number;
    day: number;
    route_info: {
      distance_km: number;
      duration_hours: number;
      start_coordinate: [number, number];
      end_coordinate: [number, number];
    };
    day_label: string;
    date: string;
    enriched: boolean;
  };
  day_number: number;
  itinerary_id: string;
  route_uuid: string;
  from_cache: boolean;
}

export const itineraryApi = {
  /**
   * Fetch enriched day data for a specific day of an itinerary
   * @param itineraryId - The itinerary UUID
   * @param dayNumber - The day number (1-indexed)
   * @returns Promise with enriched day data
   */
  async enrichDay(itineraryId: string, dayNumber: number): Promise<EnrichDayResponse> {
    const url = `${API_BASE_URL}/itinify/road-trip/enrich_day/`;
    const params = new URLSearchParams({
      itinerary_id: itineraryId,
      day_number: dayNumber.toString(),
    });

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<EnrichDayResponse>(response);
  },
};
