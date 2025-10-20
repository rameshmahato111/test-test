import { getHeaders } from "../headers";
import { API_BASE_URL, handleResponse } from "./client";
import { DealResponse } from "@/schemas/deal";

export class DealsApi {
  static async getDeals({
    page = 1,
    city,
    city_id,
    pageSize,
    token,
  }: {
    page?: number;
    city?: string;
    city_id?: string;
    pageSize?: number;
    token?: string | null;
  }): Promise<DealResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (city) searchParams.set("city", city);
      if (city_id) searchParams.set("city_id", city_id);
      if (page) searchParams.set("page", page.toString());
      if (pageSize) searchParams.set("page_size", pageSize.toString());
      const response = await fetch(
        `${API_BASE_URL}/core/deals/?${searchParams.toString()}`,
        {
          headers: getHeaders(token ?? undefined),
        }
      );
      const data = await handleResponse<DealResponse>(response);
    
      return data as DealResponse;

      // return DealResponseSchema.parse(data);
    } catch (error) {
      console.error("Get deals error:", error);
      throw error;
    }
  }

  static async getTrendingDeals(page: number = 1): Promise<DealResponse> {
    try {
      return {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    } catch (error) {
      console.error("Get trending deals error:", error);
      throw error;
    }
  }

  static async getTourPackages(page: number = 1): Promise<DealResponse> {
    try {
      //     const response = await fetch(`${API_BASE_URL}/core/deals/get_tour_packages/?page=${page}`);
      // return handleResponse<DataWithCount<Deal>>(response);
      return {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    } catch (error) {
      console.error("Get tour packages error:", error);
      throw error;
    }
  }
}
