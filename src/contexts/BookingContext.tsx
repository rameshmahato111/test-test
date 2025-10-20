"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

// Common types
export interface BaseBookingDetails {
  requestId: string;
  itemName: string;
  itemImage: string;
  currency: string;
  noOfAdults: number;
  noOfChildren: number;
}

// Hotel specific types
export interface HotelBookingDetails extends BaseBookingDetails {
  type: "hotel";
  hotelId: string;
  noOfRooms: number;
  checkIn: string;
  checkOut: string;
  address: any;
  rooms: Array<{
    roomId: number;
    rateId: number;
    roomName: string;
    boardCode: string;
    net: string;
    price: string;
    originalPrice: string;
    farePrice: string;
    taxes: {
      taxes: {
        included: boolean;
        amount: number | string;
        currency: string;
        clientAmount?: number | string;
        clientCurrency?: string;
      }[];
      allIncluded: boolean;
    } | null;
    cancellationPolicy: any;
    offers?: Array<{
      code: string;
      name: string;
      amount: string;
      user_currency?: string;
    }> | null;
  }>;
  remark?: string;
  nationality?: string;
  agesOfChildren?: Array<number>;
}

// Activity specific types
export interface ActivityBookingDetails extends BaseBookingDetails {
  type: "activity";
  activityId: string;
  modalityId: number;
  address: any;
  rateId: number;
  // rateDetailsId: number;
  rateDetails: Array<{
    id: number;
    operationDates: Array<{
      from: string;
      to: string;
      cancellationPolicies: any;
    }>;
    totalAmount: {
      amount: number;
      originalPrice: number;
      farePrice: number;
    };
  }>;
  paxes: Array<number>;
  questions: Array<{
    code: string;
    text: string;
    required: boolean;
  }>;

  answers?: Array<{
    question: {
      code: string;
      text: string;
      required?: boolean;
    };
    answer: string;
  }>;
}

export interface PassengerDetails {
  holder: {
    firstName: string;
    lastName: string;
    title?: string;
    email?: string;
    address?: string;
    zipCode?: string;
    country?: string;
    telephones?: string[];
  };
  passengers: Array<{
    firstName: string;
    lastName: string;
    age: number;
    type?: "ADULT" | "CHILD";
  }>;
}

interface BookingState {
  bookingDetails: HotelBookingDetails | ActivityBookingDetails | null;
  passengerDetails: PassengerDetails | null;
}

type BookingAction =
  | { type: "SET_HOTEL_BOOKING"; payload: HotelBookingDetails }
  | { type: "SET_ACTIVITY_BOOKING"; payload: ActivityBookingDetails }
  | { type: "SET_PASSENGER_DETAILS"; payload: PassengerDetails }
  | { type: "CLEAR_BOOKING" };

const initialState: BookingState = {
  bookingDetails: null,
  passengerDetails: null,
};

const bookingReducer = (
  state: BookingState,
  action: BookingAction
): BookingState => {
  switch (action.type) {
    case "SET_HOTEL_BOOKING":
      return {
        ...state,
        bookingDetails: action.payload,
      };
    case "SET_ACTIVITY_BOOKING":
      return {
        ...state,
        bookingDetails: action.payload,
      };
    case "SET_PASSENGER_DETAILS":
      return {
        ...state,
        passengerDetails: action.payload,
      };
    case "CLEAR_BOOKING":
      return initialState;
    default:
      return state;
  }
};

const BookingContext = createContext<
  | {
    state: BookingState;
    dispatch: React.Dispatch<BookingAction>;
  }
  | undefined
>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

// Type guard helpers
export const isHotelBooking = (
  booking: HotelBookingDetails | ActivityBookingDetails | null
): booking is HotelBookingDetails => {
  return booking?.type === "hotel";
};

export const isActivityBooking = (
  booking: HotelBookingDetails | ActivityBookingDetails | null
): booking is ActivityBookingDetails => {
  return booking?.type === "activity";
};
