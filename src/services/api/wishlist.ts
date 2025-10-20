import { API_BASE_URL, handleResponse } from "./client";
import { getHeaders } from "../headers";
import {
  BucketListResponse,
  BucketlistResponse,
  BucketListResponseSchema,
  BucketListWithItemResponse,
  BucketListWithItemResponseSchema,
  CreateBucketlist,
  WishlistItem,
  WishlistItemSchema,
  WishlistResponse,
  WishlistResponseSchema,
} from "@/schemas/wishlist";

export class WishlistAPI {
  static async addToWishlist(
    token: string,
    { object_id, content_type }: { object_id: number; content_type: string }
  ) {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/core/wishlist/`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ object_id, content_type }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getWishlist(
    token: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<WishlistResponse> {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/wishlist/?page=${page}&page_size=${pageSize}`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<WishlistResponse>(response);
      return data;
      // return WishlistResponseSchema.parse(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async wishlistIdsByUser(token: string) {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/wishlist/wishlist_ids_by_user/`,
        {
          headers: getHeaders(token),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async removeFromWishlist(
    token: string,
    { object_id, content_type }: { object_id: number; content_type: string }
  ) {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/wishlist/${object_id}/?content_type=${content_type}&object_id=${object_id}`,
        {
          method: "DELETE",
          headers: getHeaders(token),
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async searchWishlist(
    token: string,
    {
      query,
      page = 1,
      pageSize = 10,
    }: { query: string; page?: number; pageSize?: number }
  ): Promise<WishlistItem[]> {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/wishlist/search/?search_query=${query}`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<WishlistItem[]>(response);
      return data;
      // return WishlistItemSchema.array().parse(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getBucketlists(token: string): Promise<BucketListResponse[]> {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/core/bucketlist/`, {
        headers: getHeaders(token),
      });
      const data = await handleResponse<BucketListResponse[]>(response);
      return data;
      // return BucketListResponseSchema.array().parse(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getBucketlistById(
    token: string,
    { id }: { id: number }
  ): Promise<BucketListWithItemResponse> {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/bucketlist/${id}/all-wishlist-items/`,
        {
          headers: getHeaders(token),
        }
      );
      const data = await handleResponse<BucketListWithItemResponse>(response);
      return data;
      // return BucketListWithItemResponseSchema.parse(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async createBucketlist(
    token: string,
    { name, description, cover_image }: CreateBucketlist
  ): Promise<any> {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/core/bucketlist/`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ name }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async addItemToBucketlist(
    token: string,
    {
      bucketlist_id,
      wishlist_item_id,
    }: { bucketlist_id: number; wishlist_item_id: number }
  ) {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/core/bucketlist/add-wishlist-item/?bucketlist_id=${bucketlist_id}&wishlist_item_id=${wishlist_item_id}`,
        {
          method: "POST",
          headers: getHeaders(token),
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteBucketlist(token: string, { id }: { id: number }) {
    if (!token) {
      throw new Error("Token is required, Please Login.");
    }
    try {
      const response = await fetch(`${API_BASE_URL}/core/bucketlist/${id}/`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
