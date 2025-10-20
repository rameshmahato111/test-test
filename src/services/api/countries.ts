import { z } from "zod";
import { API_BASE_URL, handleResponse } from "./client";

// Define the Country schema
const CountrySchema = z.object({
  code: z.string(),
  name: z.string(),
  iso_code: z.string(),
});

// Define the CountryResponse schema
const CountryResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(CountrySchema),
});

// Types based on the schema
type CountryResponse = z.infer<typeof CountryResponseSchema>;

// Countries API
export const countriesApi = {
  // Get all countries
  getCountries: async (): Promise<CountryResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/core/country/?limit=500`, {
        method: "GET",
      });
      const data = await handleResponse<CountryResponse>(response);
      return data;
      // return CountryResponseSchema.parse(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },
};
