import { API_BASE_URL, handleResponse } from "./client";
import { getHeaders } from "../headers";
import {
  RecommendationResponse,
  RecommendationResponseSchema,
} from "@/schemas/recommendations";

export class RecommendationAPI {
  // get recommended items for the user
  static async getRecommendedItems({
    token,
    limit = 10,
    page = "1",
  }: {
    token: string;
    limit?: number;
    page?: string;
  }): Promise<RecommendationResponse> {
    // if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${API_BASE_URL}/core/recommendation/user/me/?n=${limit}&page=${page}`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<RecommendationResponse>(response);
      if (!data.count) {
        return {
          results: [],
          count: 0,
          next: null,
          previous: null,
        };
      }
      return data;
      // return RecommendationResponseSchema.parse(data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      throw new Error("Failed to load recommendations");
    }
  }

  // get recommended items for a category
  static async getRecommendedItemsByCategory(
    token: string,
    category: string,
    page: string = "1",
    page_size: number = 10
  ): Promise<RecommendationResponse> {
    // if (!token) throw new Error("Authentication required");
    if (!category) throw new Error("Category is required");

    try {
      const response = await fetch(
        `${API_BASE_URL}/core/recommendation/user/me/category/?category=${category.toUpperCase()}&n=${page_size}&page=${page}`,
        {
          method: "GET",
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<RecommendationResponse>(response);
      if (!data.count) {
        return {
          results: [],
          count: 0,
          next: null,
          previous: null,
        };
      }
      return data;
      // return RecommendationResponseSchema.parse(data);
    } catch (error) {
      console.error("Failed to fetch category recommendations:", error);
      throw new Error("Failed to load recommendations");
    }
  }

  // get recommended items for a city
  static async getRecommendedItemsByCity(
    token: string,
    city: string,
    page: string = "1",
    page_size: number = 10
  ): Promise<RecommendationResponse> {
    // if (!token) throw new Error("Authentication required");
    if (!city) throw new Error("City is required");

    try {
      const response = await fetch(
        `${API_BASE_URL}/core/recommendation/user/me/category/?category=${city.toUpperCase()}&n=${page_size}&page=${page}`, 
        {
          method: "GET",
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<RecommendationResponse>(response);
      return data;
    } catch (error) {
      console.error("Failed to fetch city recommendations:", error);
      throw new Error("Failed to load recommendations");
    }
  }

  static sendFeedback(
    id: number,
    type: "hotel" | "activity",
    feedback_type: "read" | "book",
    token?: string
  ): void {
    
    const params = new URLSearchParams({
      item_id: id.toString(),
      type,
      feedback_type,
    });
    if (!token) {
      return;
    }
    try {
      const response = fetch(
        `${API_BASE_URL}/core/recommendation/send_feedback/?${params.toString()}`,
        {
          method: "GET",
          headers: getHeaders(token),
        }
      );
    } catch (error) {
      // Just log the error since this is a fire-and-forget operation
      console.error("Failed to send recommendation feedback:", error);
    }
  }

  static async getTrendings({
    page,
    limit = 10,
    token,
  }: {
    page: number;
    limit?: number;
    token?: string | null;
  }): Promise<RecommendationResponse> {
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/recommendation/trending/?n=${limit}&page=${page}`,
        {
          method: "GET",
          headers: getHeaders(token ?? undefined),
        }
      );
      const data = await handleResponse<RecommendationResponse>(response);
     
      // return RecommendationResponseSchema.parse(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch trending recommendations:", error);
      throw new Error("Failed to load recommendations");
    }
  }
}
