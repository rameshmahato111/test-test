import { handleResponse } from "./client";
import { API_BASE_URL } from "./client";
import { PostReviewParams } from "@/types/details";
import { getHeaders } from "../headers";
import {
  ReviewResponse,
  ReviewStatsResponse,
} from "@/schemas/review";
import { NearbyResponse } from "@/schemas/nearby";
import { ActivityResponse } from "@/schemas/activities";
import { HotelResponse } from "@/schemas/hotel";
import {
  ReCheckAvailability,
} from "@/schemas/re-check";

interface CheckAvailabilityParams {
  hotel_id: string;
  check_in_date: string;
  check_out_date: string;
  no_of_rooms: number;
  no_of_adults: number;
  no_of_children: number;
  ages_of_children?: number[];
  nationality: string;
}

interface GetActivityModalitiesParams {
  activity_id: string;
  from_date: string;
  to_date: string;
  paxes: number[];
}
interface ReCheckAvailabilityParams {
  request_id: string;
  hotel_id: string;
  room_id: number;
  rate_id: number;
}

export const detailAPI = {
  // DETAILS API
  getDetail: async (
    id: string,
    type: string,
    token: string | null
  ): Promise<any> => {
    switch (type) {
      case "hotel": {
        try {
          const response = await fetch(`${API_BASE_URL}/core/hotel/${id}/`, {
            method: "GET",
            headers: getHeaders(token ?? undefined),
          });
          const responseData = await handleResponse<HotelResponse>(response);
          // @ts-ignore
          if (
            responseData.request_id &&
            responseData &&
            responseData.data !== null
          ) {
            // const parsedData=  HotelResponseSchema.parse(responseData);

            responseData.data!["request_id"] = responseData.request_id;
            return responseData.data;
          } else {
            throw new Error("No data found");
          }
        } catch (error) {
          console.error("Error in hotel details:", error);
          throw error;
        }
      }
      case "activity": {
        try {
          const response = await fetch(`${API_BASE_URL}/core/activity/${id}/`, {
            method: "GET",
            headers: getHeaders(token ?? undefined),
          });
          const responseData = await handleResponse<ActivityResponse>(response);
          if (responseData.request_id && responseData.data) {
            // const parsedData = await ActivityResponseSchema.parse(responseData);
            responseData.data!["request_id"] = responseData.request_id;
            console.log("get responseData", responseData)
            return responseData.data;
          } else {
            throw new Error("No data found");
          }
        } catch (error) {
          console.error("Error in activity details:", error);
          throw error;
        }
      }
      default:
        throw new Error("Invalid type specified");
    }
  },

  checkHotelAvailability: async (
    params: CheckAvailabilityParams,
    token: string | null
  ): Promise<HotelResponse> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set("hotel_id", params.hotel_id);
      searchParams.set("check_in_date", params.check_in_date);
      searchParams.set("check_out_date", params.check_out_date);
      searchParams.set("no_of_rooms", params.no_of_rooms.toString());
      searchParams.set("no_of_adults", params.no_of_adults.toString());
      searchParams.set("no_of_children", params.no_of_children.toString());
      searchParams.set("nationality", params.nationality);
      if (params.ages_of_children) {
        searchParams.set("ages_of_children", params.ages_of_children.join(","));
      }
      const response = await fetch(
        `${API_BASE_URL}/core/availability/hotel/?${searchParams.toString()}`,
        {
          method: "GET",
          headers: getHeaders(token ?? undefined),
        }
      );
      const responseData = await handleResponse<HotelResponse>(response);
      if (responseData.request_id && responseData.data) {
        return responseData;
        // return HotelResponseSchema.parse(responseData);
      } else {
        return {
          request_id: null,
          data: null,
        };
      }
    } catch (error) {
      console.error("Error in check availability:", error);
      if (error instanceof Error) {
        throw `${error.message}`;
      }
      throw new Error("Something went wrong");
    }
  },

  checkActivityAvailability: async (
    params: GetActivityModalitiesParams,
    token: string | null
  ): Promise<ActivityResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/availability/activity/?activity_id=${
          params.activity_id
        }&from_date=${params.from_date}&to_date=${
          params.to_date
        }&paxes=${params.paxes.join(",")}`,
        {
          method: "GET",
          headers: getHeaders(token ?? undefined),
        }
      );
      const data = await handleResponse<ActivityResponse>(response);
      return data;
      // return ActivityResponseSchema.parse(data);
    } catch (error) {
      console.error("Error in activity modalities:", error);
      throw error;
    }
  },

  // Re-Check Availability
  reCheckHotelAvailability: async (
    params: ReCheckAvailabilityParams,
    token: string
  ): Promise<ReCheckAvailability> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/hotel/booking/check_rate_optional/`,
        {
          method: "POST",
          headers: getHeaders(token),
          body: JSON.stringify(params),
        }
      );
      const responseData = await handleResponse<ReCheckAvailability>(response);
      return responseData;
      // return ReCheckAvailabilitySchema.parse(responseData);
    } catch (error) {
      console.error("Error in re-check availability:", error);
      throw error;
    }
  },

  // NEARBY API

  getHotelNearyBy: async (
    id: string,
    token: string | null
  ): Promise<NearbyResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/core/hotel/nearby/${id}/`, {
        method: "GET",
        headers: getHeaders(token ?? undefined),
        next: { revalidate: 600 }, // Cache for 10 minutes instead of no-store
      });
      const data = await handleResponse<NearbyResponse>(response);
      return data;
      // return NearbyResponseSchema.parse(data);
    } catch (error) {
      console.error("Error in hotel nearby:", error);
      throw error;
    }
  },
  // Activity Nearby API
  getActivityNearyBy: async ({
    id,
    page = 1,
    page_size = 10,
    token,
  }: {
    id: string;
    page?: number;
    page_size?: number;
    token: string | null;
  }): Promise<NearbyResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/activity/nearby/${id}/?page=${page}&page_size=${page_size}`,
        {
          method: "GET",
          headers: getHeaders(token ?? undefined),
          next: { revalidate: 600 }, // Cache for 10 minutes instead of no-store
        }
      );

      const data = await handleResponse<NearbyResponse>(response);
      return data;
      // return NearbyResponseSchema.parse(data);
    } catch (error) {
      console.error("Error in activity nearby:", error);
      throw error;
    }
  },

  // REVIEWS API
  getReviews: async ({
    id,
    type,
    page = 1,
    limit = 5,
  }: {
    id: string;
    type: string;
    page?: number;
    limit?: number;
  }): Promise<ReviewResponse> => {
    const params = new URLSearchParams();
    params.set("object_id", id);
    params.set("content_type", type);
    params.set("page", page.toString());
    params.set("page_size", limit.toString());
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/?${params.toString()}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );
      const data = await handleResponse<ReviewResponse>(response);
      return data;
      // return ReviewResponseSchema.parse(data);
    } catch (error) {
      console.error("Error in reviews:", error);
      throw error;
    }
  },
  // REVIEW STATS API
  getReviewStats: async (
    id: string,
    type: string
  ): Promise<ReviewStatsResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/stats/?object_id=${id}&content_type=${type}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );
      const data = await handleResponse<ReviewStatsResponse>(response);
      return data;
      // return reviewStatsSchema.parse(data);
    } catch (error) {
      console.error("Error in review stats:", error);
      throw error;
    }
  },
  // POST REVIEW API
  postReview: async (params: PostReviewParams, token: string): Promise<any> => {
    if (!token) throw new Error("No token found Please login");
    try {
      const formData = new FormData();

      formData.append("object_id", params.object_id);
      formData.append("content_type", params.content_type);
      formData.append("rating", params.rating.toString());
      formData.append("comment", params.comment);

      if (params.images && params.images.length > 0) {
        params.images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/core/reviews/`, {
        method: "POST",
        headers: {
          ...getHeaders(token, false),
        },
        body: formData,
      });
      const data = await handleResponse<any>(response);
      return data;
    } catch (error) {
      console.error("Error in post review:", error);
      throw error;
    }
  },
  likeReview: async (reviewId: string, token: string): Promise<any> => {
    if (!token) throw new Error("No token found Please login");
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/${reviewId}/like/`,
        {
          method: "GET",
          headers: {
            ...getHeaders(token, false),
          },
        }
      );
      return await handleResponse<any>(response);
    } catch (error) {
      console.error("Error in like review:", error);
      throw error;
    }
  },
  dislikeReview: async (reviewId: string, token: string): Promise<any> => {
    if (!token) throw new Error("No token found Please login");
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/${reviewId}/dislike/`,
        {
          method: "GET",
          headers: {
            ...getHeaders(token),
          },
        }
      );
      return await handleResponse<any>(response);
    } catch (error) {
      console.error("Error in dislike review:", error);
      throw error;
    }
  },
  unLikeReview: async (reviewId: string, token: string): Promise<any> => {
    if (!token) throw new Error("No token found Please login");
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/${reviewId}/unlike/`,
        {
          method: "GET",
          headers: {
            ...getHeaders(token),
          },
        }
      );
      return await handleResponse<any>(response);
    } catch (error) {
      console.error("Error in remove like review:", error);
      throw error;
    }
  },
  isLikedOrDisliked: async (reviewId: string, token: string): Promise<any> => {
    if (!token) throw new Error("No token found Please login");
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/${reviewId}/is_liked_or_disliked/`,
        {
          method: "GET",
          headers: {
            ...getHeaders(token),
          },
        }
      );

      const data = await handleResponse<any>(response);

      return data;
    } catch (error) {
      console.error(
        "Error in is liked or disliked for review",
        reviewId,
        ":",
        error
      );
      throw error;
    }
  },
};
