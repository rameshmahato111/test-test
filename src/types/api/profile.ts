export interface ProfilePatch {
  email: string;
  phone_number: string;
  full_name: string;
  city: number;
  profile_picture?: File;
  first_name?: string;
  last_name?: string;
}

export interface CitySearchSuggestions {
  id: number;
  name: string;
  country_name: string;
  country_code: string;
  image: string;
  coordinates: [number, number];
}

