import { CitySearchSuggestions, ProfilePatch } from "@/types/api/profile";
import { getHeaders } from "../headers";
import { API_BASE_URL, handleResponse } from "./client";
import { User } from "@/types/api";
import { MyReviewResponse, myReviewResponseSchema } from "@/schemas/profile";

export class ProfileApi {
  static async getProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/core/profile/me/`, {
        headers: getHeaders(token),
      });
      const data = handleResponse<User>(response);
      return data;
    } catch (error) {
      console.error("Error while fetching profile", error);
      throw error;
    }
  }

  static async getCitySearchSuggestions(
    search?: string
  ): Promise<{ results: CitySearchSuggestions[] }> {
    try {
      const url = new URL(`${API_BASE_URL}/core/display-cities/search_cities/`);
      url.searchParams.append("page_size", "30");
      if (search) {
        url.searchParams.append("q", search);
      }

      const response = await fetch(url.toString(), {
        headers: getHeaders(),
      });
      const data = handleResponse<{ results: CitySearchSuggestions[] }>(
        response
      );
      return data;
    } catch (error) {
      console.error("Error while fetching city search suggestions", error);
      throw error;
    }
  }
  static async patchProfile(
    token: string,
    body: Partial<ProfilePatch> | FormData
  ): Promise<User> {
    try {
      const headers =
        body instanceof FormData
          ? getHeaders(token, false)
          : {
              ...getHeaders(token),
              "Content-Type": "application/json",
            };

      const response = await fetch(`${API_BASE_URL}/core/profile/me/partial/`, {
        headers,
        method: "PATCH",
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
      const data = handleResponse<User>(response);
      return data;
    } catch (error) {
      console.error("Error while patching profile", error);
      throw error;
    }
  }
  // REVIEWS
  static async getReviews(
    token: string,
    page: number = 1
  ): Promise<MyReviewResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/my_reviews/?page=${page}`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<MyReviewResponse>(response);
      return data;
      //   return  myReviewResponseSchema.parse(data);
    } catch (error) {
      console.error("Error while fetching reviews", error);
      throw error;
    }
  }
}
