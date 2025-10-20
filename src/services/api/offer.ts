import { API_BASE_URL } from "./client";
import { OfferResponse, OfferResponseSchema } from "@/schemas/offer";
import { handleResponse } from "./client";
import { z } from "zod";

export class OfferApi {
  static async getOffers(): Promise<OfferResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/core/offer/`);
      const resData = await handleResponse<OfferResponse>(response);
      return resData as OfferResponse;
      // return OfferResponseSchema.parse(resData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Data validation error:",
          error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join("\n")
        );
      }
      throw `Failed to fetch offers: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
  }
}
