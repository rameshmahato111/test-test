import { API_BASE_URL, handleResponse } from "./client";

import { HotelSearchParams, HotelSearchSuggestions } from "@/types/search";

import {
  HotelSearchResponse,
} from "@/schemas/hotel";
import { getHeaders } from "../headers";

export const hotelApi = {
  async searchHotels(
    params: HotelSearchParams,
    token: string | null
  ): Promise<HotelSearchResponse> {
    const queryParams = new URLSearchParams({
      ...(params.hotel_query && { search_query: params.hotel_query }),
      ...(params.start_date && { check_in_date: params.start_date }),
      ...(params.end_date && { check_out_date: params.end_date }),
      ...(params.no_of_rooms && { no_of_rooms: params.no_of_rooms.toString() }),
      ...(params.no_of_adults && {
        no_of_adults: params.no_of_adults.toString(),
      }),
      ...{ no_of_children: params.no_of_children?.toString() || "0" },
      ...(params.nationality && { nationality: params.nationality }),
      ...(params.page && { page: params.page.toString() }),
    });

    if (params.no_of_children > 0 && params.ages_of_children?.length > 0) {
      queryParams.append("ages_of_children", params.ages_of_children.join(","));
    }

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toString());
        }
      });
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/hotel-search/?${queryParams.toString()}`,
        {
          headers: getHeaders(token ?? undefined),
        }
      );
      const data = await handleResponse<HotelSearchResponse>(response);
      if (!data.count) {
        return {
          results: [],
          count: 0,
          next: null,
          previous: null,
        };
      }
      return data;
    } catch (error) {
      console.error("Error searching hotels:", error);

      throw new Error(
        error instanceof Error
          ? `Failed to fetch: ${error.message}`
          : "Network error occurred while searching hotels"
      );
    }
  },

  async getHotelQuerySuggestions(searchQuery?: string): Promise<HotelSearchSuggestions> {
    try {
      const url = `${API_BASE_URL}/core/hotel/get_hotels_regions_suggestions/${
        searchQuery ? `?search_query=${encodeURIComponent(searchQuery)}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching hotel suggestions:", error);
      return { regions: [], hotels: [] };
    }
  },
};
