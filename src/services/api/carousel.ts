  import { CarouselResponse } from "@/schemas/carousel";
import { API_BASE_URL, handleResponse } from "./client";

export class CarouselAPI {
  static getTopCarousel = async (
    carouselType: string = "activity"
  ): Promise<CarouselResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/carousel/?carousel_type=${carouselType.toUpperCase()}`
      );
      const data = await handleResponse(response);
      return data as CarouselResponse;
      // return carouselResponseSchema.parse(data)
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
