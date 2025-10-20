import { getHeaders } from "../headers";
import { API_BASE_URL, handleResponse } from "./client";

interface BookingResponse {
  status: string;
  payment?: {
    checkout_url: string;
    amount: number;
    currency: string;
  };
}

interface ActivityBookingResponse extends BookingResponse {}
interface HotelBookingResponse extends BookingResponse {}

export const BookingApi = {
  hotelConfirmBooking: async (body: any, token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/core/hotel/booking/confirm_booking/`,
      {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(body),
      }
    );
    const data = await handleResponse(response);
    // @ts-ignore
    return data?.status || "Failed";
  },
  hotelPreconfirmBooking: async (
    body: any,
    token: string
  ): Promise<HotelBookingResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/core/hotel/booking/preconfirm_booking/`,
      {
        method: "POST",
        headers: getHeaders(token, true),
        body: JSON.stringify(body),
      }
    );
    const data = await handleResponse(response);
    return {
      // @ts-ignore
      status: data?.status || "Failed",
      // @ts-ignore
      payment: data?.payment,
    };
  },
  activityConfirmBooking: async (
    body: any,
    token: string
  ): Promise<ActivityBookingResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/core/activity/booking/preconfirm_booking/`,
      {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(body),
      }
    );
    const data = await handleResponse(response);
    return {
      // @ts-ignore
      status: data?.status || "Failed",
      // @ts-ignore
      payment: data?.payment,
    };
  },
};
