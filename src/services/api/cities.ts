import { getHeaders } from "../headers";
import { handleResponse } from "./client";

import { API_BASE_URL } from "./client";
import {
  CategoryActivityResponse,
  City,
  CityResponse,
} from "@/schemas/cities";
interface CategoryActivityParams {
  page?: number;
  page_size?: number;
  category_id?: number;
  city?: string;
}

export const citiesApi = {
  async getPopularCities(): Promise<CityResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/display-cities/?page_size=10`,
        {
          next: {
            revalidate: 5, // Cache for 1 hour instead of 0
          },
        }
      );
      const data = await handleResponse<CityResponse>(response);
      return data;
      // return CityResponseSchema.parse(data);
    } catch (error) {
      console.error("Get popular cities error:", error);
      throw error;
    }
  },
  async getAllCities(
    page_size: number = 16,
    page: number = 1
  ): Promise<CityResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/display-cities/?page_size=${page_size}&page=${page}`,
        
      );

      const data = await handleResponse<CityResponse>(response);
      return data;
        // return CityResponseSchema.parse(data);
    } catch (error) {
      console.error("Get all cities error:", error);
      throw error;
    }
  },
  async getCityDetails(id: string): Promise<City> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/display-cities/${id}/`
      );

      const data = await handleResponse<City>(response);
      return data;
      // return CitySchema.parse(data);
    } catch (error) {
      console.error("Get city details error:", error);
      throw error;
    }
  },
  async getNearbyCities(
    id: string,
    radius: number = 100
  ): Promise<CityResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/display-cities/nearby/?radius=${radius}&city_id=${id}`
      );
      const responseData = await handleResponse<CityResponse>(response);
      return responseData;
      // return CityResponseSchema.parse(responseData);
    } catch (error) {
      console.error("Get nearby cities error:", error);
      throw error;
    }
  },

  async getCategoryActivities(
    params: CategoryActivityParams,
    token?: string | null
  ): Promise<CategoryActivityResponse> {
    try {
      const { page = 1, page_size = 16, category_id, city } = params;
      const cityParam = city ? `&city=${city}` : "";
      const response = await fetch(
        `${API_BASE_URL}/core/categories/activity/?category_id=${category_id}&page=${page}&page_size=${page_size}${cityParam}`,
        {
          headers: getHeaders(token ?? undefined),
          next: { revalidate: 10 }, // Cache for 30 minutes instead of no-store
        }
      );
      const data = await handleResponse<CategoryActivityResponse>(response);
     
      return data;
      // return CategoryActivityResponseSchema.parse(data);
    } catch (error) {
      console.error("Get category activities error:", error);
      throw error;
    }
  },
};
