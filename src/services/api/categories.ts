import { API_BASE_URL, handleResponse } from "./client";
import { CategoryResponse, CategoryResponseSchema } from "@/schemas/categories";
import { z } from "zod";

export const categoriesApi = {
  async getCategories(
    categoryType: string = "activity"
  ): Promise<CategoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/categories/?category_type=${categoryType}`
      );
      const resData = await handleResponse<CategoryResponse>(response);
      return resData as CategoryResponse;
      // return CategoryResponseSchema.parse(resData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          "Data validation error:",
          error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join("\n")
        );
      }
      throw new Error(
        `Failed to fetch categories: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
  async getCategoriesByCity(city_id: string): Promise<CategoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/categories/category/city/?city_id=${city_id}`
      );
      const data = await handleResponse<CategoryResponse>(response);
      return data as CategoryResponse;

      // return CategoryResponseSchema.parse(data);
    } catch (error) {
      console.error("Get categories by city error:", error);
      throw error;
    }
  },
};
