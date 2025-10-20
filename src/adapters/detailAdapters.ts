import { CommonDetailPageData } from "@/types/details";
import { HotelResult } from "@/schemas/hotel";
import { Activity } from "@/schemas/activities";

export const detailAdapters = {
  hotel: (data: unknown): CommonDetailPageData => {
   
    const hotelData = data as HotelResult;
    return {
      // Common fields
      request_id: hotelData.request_id || "",
      id: hotelData.id,
      name: hotelData.name,
      description: hotelData.description,

      images: hotelData.hotel_images.map((image) => ({
        url: `${image.path}`,
        label: hotelData.name,
      })),
      
      currency: hotelData.currency,
      avg_rating: hotelData.avg_rating,
      checkInDate: hotelData.checkInDate,
      checkOutDate: hotelData.checkOutDate,
      // @ts-ignore
      noOfAdults: hotelData.noOfAdults,
      // @ts-ignore
      noOfChildren: hotelData.noOfChildren,
      // @ts-ignore
      noOfRooms: hotelData.noOfRooms,
      // @ts-ignore
      agesOfChildren: hotelData.agesOfChildren,
      exchangeRate: hotelData.exchangeRate,
      supplierCode: hotelData.supplierCode.toString(),
      rooms: hotelData.rooms,
      minRate: hotelData.minRate,

      maxRate: hotelData.maxRate,
      originalPrice: hotelData.originalPrice || '',
      farePrice: hotelData.farePrice || '',
      facilities: hotelData.facilities,
      address: hotelData.address,
      contact: hotelData.contact,
    };
  },

  activity: (data: unknown): CommonDetailPageData => {
    const activityData = data as Activity;
    return {
      // Common fields
      request_id: activityData.request_id,
      id: activityData.id,
      name: activityData.name,
      description: activityData.description,
      checkInDate: activityData.from_date,
      checkOutDate: activityData.to_date,
      paxes: activityData.paxes,
      language: activityData.images[0].language,
      images: activityData.images.map((image) => ({
        url: dataImage(image),
        label: activityData.name,
      })),
      currency: activityData.currency,
      type: activityData.type,
      avg_rating: activityData.avg_rating,
      activityLocation: activityData.location,
      operationDays: activityData.operationDays,
      modalities: activityData.modalities,
      // @ts-ignore
      amountsFrom: activityData.amountsFrom,
      originalPrice: activityData.amountsFrom[0].originalPrice?.toString() ?? "0",
      farePrice: activityData.amountsFrom[0].farePrice?.toString() ?? "0",
      country: activityData.country,
      importantInfo: activityData.importantInfo,
      extraInfo: {
        routes: activityData.extraInfo.routes,
        redeemInfo: activityData.extraInfo.redeemInfo,
        featureGroups: activityData.extraInfo.featureGroups,
      },
    };
  },
} as const;

export type DetailAdapters = typeof detailAdapters;

export const dataImage = (image: any): string => {
  const sizePreference = ["LARGE2", "MEDIUM", "LARGE", "XLARGE"];

  // Find the first available image URL matching our size preference order
  for (const size of sizePreference) {
    const matchingUrl = image.urls.find((url: any) => url.sizeType === size);
    if (matchingUrl) {
      return matchingUrl.resource;
    }
  }

  // If none of the preferred sizes are found, return the first available URL
  return image.urls[0].resource;
};
