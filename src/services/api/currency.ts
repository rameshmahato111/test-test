import { CurrencyResponse } from "./types/currency";
import { API_BASE_URL } from "./client";

export class CurrencyService {
  private static instance: CurrencyService;
  private readonly baseUrl = `${API_BASE_URL}/core/currency/?limit=500`; // Updated endpoint

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  /**
   * Fetches list of available currencies
   * @returns Promise with currency list response
   */
  async getCurrencies(): Promise<CurrencyResponse> {
    const response = await fetch(this.baseUrl, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Currency API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    return data;
  }
}

export const currencyService = CurrencyService.getInstance();
