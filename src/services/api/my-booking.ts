import { API_BASE_URL, handleResponse } from "./client";
import { getHeaders } from "../headers";
import {
  ActivityBooking,
  ActivityBookingResponse,
  ActivityBookingResponseSchema,
  activityBookingSchema,
  HotelBookingResponse,
  HotelBookingResponseSchema,
  hotelBookingSchema,
} from "@/schemas/bookings";

export const MyBookingApi = {
  getHotelBookings: async (
    token: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<HotelBookingResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/hotel/booking/?page=${page}&page_size=${pageSize}`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<HotelBookingResponse>(response);

      // console.log(data);

      return data;
      // return HotelBookingResponseSchema.parse(data);
    } catch (error) {
      console.error("Error fetching hotel bookings:", error);
      throw error;
    }
  },

  getActivityBookings: async (
    token: string
  ): Promise<ActivityBookingResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/core/activity/booking/`, {
        headers: getHeaders(token),
      });
      const data = await handleResponse<ActivityBookingResponse>(response);
      return data;
      // return ActivityBookingResponseSchema.parse(data);
    } catch (error) {
      console.error("Error fetching activity bookings:", error);
      throw error;
    }
  },

  cancelHotelBooking: async (
    token: string,
    bookingId: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/hotel/booking/${bookingId}/`,
        {
          method: "DELETE",
          headers: getHeaders(token),
        }
      );
      await handleResponse(response);
    } catch (error) {
      console.error("Error cancelling hotel booking:", error);
      throw error;
    }
  },
  cancelActivityBooking: async (
    token: string,
    bookingId: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/activity/booking/${bookingId}/`,
        {
          method: "DELETE",
          headers: getHeaders(token),
        }
      );
      await handleResponse(response);
    } catch (error) {
      console.error("Error cancelling activity booking:", error);
      throw error;
    }
  },
  getExistingReviewsInfoByUser: async (token: string): Promise<any> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/reviews/get_existing_reviews_info_by_user/`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<any>(response);

      return data;
    } catch (error) {
      console.error("Error fetching existing reviews info by user:", error);
      throw error;
    }
  },
};
