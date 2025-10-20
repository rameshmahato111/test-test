export interface HotelSearchParams {
  hotel_query: string;
  start_date: string | null;
  end_date: string | null;
  no_of_rooms: number;
  no_of_adults: number;
  no_of_children: number;
  // teens?: number;
  // infants?: number;
  // seniors?: number;
  nationality: string | null;
  page?: number;
  filters?: Partial<HotelFilters>;
  ages_of_children:number[]
  sort?: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  class: string;
  nationality: string;
  tripType: 'one-way' | 'round-trip';
  travelers: string;
  sort?: string;
  page?: number;
}



export interface ActivitiesSearchParams {
  query?: string;
  sort?: string;
  start_date?: string;
  end_date?: string;
  star?: string;
  budget?: string;
  category?: string;
  city?: string;
  longitude?: string;
  latitude?: string;
  page?: string;
 
}

export type SearchParams = {
  tab: string;
} & (HotelSearchParams | FlightSearchParams | ActivitiesSearchParams); 

export interface HotelFilters {
  minRate?: number;
  maxRate?: number;
  min_review_rating?: number;
  max_review_rating?: number;
  hotel_rating?: number;
  reservation_policy?: string;
  meal_plan?: string;
  bed_type?: string;
  
}


export interface HotelSearchSuggestions {
  regions: {
    id: string;
    name: string;
    country: string;
    country_flag: string;
    location_detail: string;
    type: string;
    source: string;
  }[],
  hotels: {
    id: string;
    name: string;
    country_name: string;
    country_flag: string;
    address: string;
    city: string;
  }[]
}