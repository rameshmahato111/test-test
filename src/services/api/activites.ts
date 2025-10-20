import { ActivitiesSearchParams } from "@/types/search";
import { API_BASE_URL, handleResponse } from "./client";
import {
  Activity,
  ActivitiesResponseSchema,
  ActivityResponseWithCount,
} from "@/schemas/activities";
import { z } from "zod";
import { getHeaders } from "../headers";

export class ActivityApi {
  static searchActivities = async (
    params: ActivitiesSearchParams,
    token: string | null
  ): Promise<ActivityResponseWithCount> => {
    // Memoize URL params construction
    const buildUrlParams = (params: ActivitiesSearchParams) => {
      const urlParams = new URLSearchParams();
      const paramMapping = {
        query: "search_query",
        start_date: "from_date",
        end_date: "to_date",
        budget: "budget",
        category: "category",
        longitude: "longitude",
        latitude: "latitude",
        star: "rating",
        sort: "sort",
        page: "page",
      };

      Object.entries(params).forEach(([key, value]) => {
        if (value && key in paramMapping) {
          urlParams.set(
            paramMapping[key as keyof typeof paramMapping],
            value.toString()
          );
        }
      });
      return urlParams;
    };

    try {
      const urlParams = buildUrlParams(params);
      const response = await fetch(
        `${API_BASE_URL}/core/activity-search/?${urlParams.toString()}`,
        {
          headers: getHeaders(token ?? undefined),
        }
      );
      const resData = await handleResponse<ActivityResponseWithCount>(response);
      if (!resData.count) {
        return {
          results: [],
          count: 0,
          next: null,
          previous: null,
        };
      }
      return resData;
      //  return ActivitiesResponseSchema.parse(resData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Data validation error:",
          error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join("\n")
        );
      }
      throw new Error(
        `Failed to fetch categories: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  static async getActivityById(id: string): Promise<Activity> {
    try {
      const response = await fetch(`${API_BASE_URL}/core/activity/${id}`);
      return handleResponse<Activity>(response);
    } catch (error) {
      console.error("error in Activities API", error);
      throw error;
    }
  }
  static async getActivityQuerySuggestions(
    searchQuery?: string
  ): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/hotel/get_activity_query_suggestions/${
          searchQuery ? `?search_query=${encodeURIComponent(searchQuery)}` : ""
        }`
      );
      return handleResponse<string[]>(response);
    } catch (error) {
      console.error("Error fetching activity suggestions:", error);
      return [];
    }
  }
}
