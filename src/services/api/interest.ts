import {
  InterestResponse,
  ChoiceResponse,
} from "@/schemas/interest";
import { getHeaders } from "../headers";
import { API_BASE_URL, handleResponse } from "./client";

export class InterestService {
  static async getChoices(): Promise<ChoiceResponse> {
    const response = await fetch(`${API_BASE_URL}/core/choices/`);

    const data = await handleResponse<ChoiceResponse>(response);

    return data;
    // return choiceResponseSchema.parse(data);
  }
  static async getInterests(token: string): Promise<InterestResponse> {
    const response = await fetch(`${API_BASE_URL}/core/interest/`, {
      headers: getHeaders(token),
    });
    const data = await handleResponse<InterestResponse>(response);
    // return interestSchema.parse(data);
    return data;
  }
  static async createInterests(
    token: string,
    interests: number[]
  ): Promise<Boolean> {
    const response = await fetch(`${API_BASE_URL}/core/interest/`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ segment: interests }),
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  }
}
