import { ActivityLocation, Modalities } from "@/schemas/activities";
import { HotelContact, HotelRoom } from "@/schemas/hotel";

import { HotelAddress } from "@/schemas/hotel";

export interface CommonDetailPageData {
  request_id?: string;
  id: string | number;
  name: string;
  description: string;
  images: Array<{
    url: string;
    label: string;
  }>;
  price?: {
    amount:  number;
    currency: string;
  };
 
  rooms?: HotelRoom[];
  avg_rating?: number;
  minRate?: string;
  maxRate?: string;
  originalPrice?: string;
  farePrice?: string;
  exchangeRate?: number | null;
  noOfRooms?: number;
  noOfAdults?:  string;
  noOfChildren?: string;
  agesOfChildren?:number[];
  supplierCode?: string;
  categoryName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  facilities?: Array<{
    description: string;
    image: string | null;
    facility_fee: boolean;
  }>;
  paxes?: number[];

  address?: HotelAddress;
  contact?: HotelContact;
  currency?: string;

// activity specific
 activityLocation?: ActivityLocation;
  type?: string;
  operationDays?: Array<{
    code: string;
    name: string;
  }>;
  modalities?: Modalities[];
  country?: {
    destinations: Array<{
      name: string;
      code: string;
    }>;
  };
  amountsFrom?: Array<{
    paxType: string;
    ageFrom: number;
    ageTo: number;
    amount: number;
    boxOfficeAmount: number;
    mandatoryApplyAmount: boolean;
    originalPrice: number;
    farePrice: number;
  }>;

  importantInfo?: string[];
  language?: any;
  extraInfo?: {
    featureGroups: Array<{
      groupCode: string;
      included?: Array<{
        featureType: string;
        description: string;
      }>;
      excluded?: Array<{
        featureType: string;
        description: string;
      }>;
    }>;
    routes:any [];
    redeemInfo:any;
  };
}

export interface RatingData {
    stars: number;
    count: number;
}

export interface RatingSectionProps {
    ratings: RatingData[];
    totalReviews: number;   
}


export interface ReviewCardProps {
  reviewId: number;
    userImage: string;
    userName: string;
    rating: number;
    timeAgo: string;
    review: string;
    initialLikes?: number;
    initialDislikes?: number;
    images?: Array<{
        caption?: string | null;
        id: number;
        image: string;
    }>;
    like_count?: number;
    dislike_count?: number;
    isOwner?: boolean;
    isFromProfile?: boolean;
    
}


export interface PostReviewParams {
    object_id: string;
    content_type: string;
    rating: number;
    comment: string;
    images?: File[];
}
