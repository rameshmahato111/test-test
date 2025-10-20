import { string, z } from "zod";
import { createResponseWithCountSchema } from "./common";

export const RateCommentsIdSchema= z.object({
  comments:z.array(z.object({
    dateEnd:z.string(),
    dateStart:z.string(),
    description:z.string(),
  })),
  rateCodes:z.array(z.number())

})
export const RateSchema = z.object({
  id: z.number(),
  net: z.string(),
  discount: z.string().nullable(),
  discountPCT: z.string().nullable(),
  sellingRate: z.string().nullable(),
  originalPrice: z.string().nullable(),
  farePrice: z.string().nullable(),
  boardCode: z.string(),
  boardName: z.string(),
  rateCommentsId: z.array(RateCommentsIdSchema).nullable(),
  allotment: z.number(),
  hasReCheck: z.boolean(),
  promotions: z.array(z.object({
    code: z.string(),
    name: z.string(),
    
  })).optional().nullable(),
  cancellationPolicies: z.array(z.object({
    amount: z.string().nullable(),
    from: z.string().optional(),
    currency: z.string().optional(),
  })),
  taxes: z.object({
    taxes: z.array(z.object({
      included:z.boolean(),
      amount:z.number().or(z.string()),
      currency:z.string(),
      clientAmount:z.number().or(z.string()).optional(),
      clientCurrency:z.string().optional(),
    })),
    allIncluded:z.boolean(),
  }).nullable(),
  offers: z.array(z.object({
    code: z.string(),
    name: z.string(),
    amount: z.string(),
    user_currency: z.string().optional()
  })).nullable()
});

export const OfferSchema = z.object({
  code: z.string(),
  name: z.string(),
  amount: z.string(),
  user_currency: z.string().optional()
});



export const RoomImageSchema = z.object({
  path: z.string(),
  order: z.number(),
  roomCode: z.string(),
  roomType: z.string(),
  visualOrder: z.number(),
  imageTypeCode: z.string(),
  characteristicCode: z.string()
});

export const HotelRoomSchema = z.object({
  id: z.number(),
  room_code: z.string(),
  name: z.string(),
  maxPax: z.number().nullable(),
  minPax: z.number().nullable(),
  maxAdults: z.number().nullable(),
  minAdults: z.number().nullable(),
  maxChildren: z.number().nullable(),
  rates: z.array(RateSchema),
  images: z.array(RoomImageSchema),
  amenities:z.array(z.string())
});

export const HotelAddressSchema =  z.object({
    content: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    city: z.string(),
    state: z.string(),
    postalCode: z.string()
  });

export const HotelContactSchema = z.object({
  email: z.string(),
  phones: z.array(z.object({
    phone_type: z.string(),
    phone_number: z.string()
  })),
  website: z.string()
});

export const ReviewSchema = z.object({
  rate: z.number(),
  reviewCount: z.number(),
  type: z.string()
});

export const HotelSchema = z.object({
  request_id: z.string().nullable().optional(),
  id: z.number(),
  name: z.string(),
  supplierCode: z.number(),
  categoryName: z.string(),
  description: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  noOfRooms: z.number().or(z.string()),
  noOfAdults: z.number().or(z.string()),
  noOfChildren: z.number().or(z.string()),
  agesOfChildren: z.array(z.number()).optional().nullable(),
  nationality: z.string(),
  avg_rating: z.number(),
  reviews: z.array(ReviewSchema).optional(),
  address:HotelAddressSchema,
  contact:HotelContactSchema,
  rooms: z.array(HotelRoomSchema),
  minRate: z.string(),
  maxRate: z.string(),
  originalPrice:z.string().nullable(),
  farePrice:z.string().nullable(),
   exchangeRate:z.number().nullable(),
  currency: z.string(),
  hotel_images: z.array(z.object({
    path: z.string(),
    order: z.number(),
    visualOrder: z.number(),  
    imageTypeCode: z.string()
  })),
  boardCodes: z.array(z.string()),
  facilities: z.array(z.object({
    description: z.string(),
    image: z.string().nullable(),
    facility_fee:z.boolean(),
  
  })),
  top_facilities: z.array(z.object({
    order:z.number(),
    description:z.string(),
    image:z.string().nullable(),
  })).optional().nullable(),
 
});

export const HotelResponseSchema = z.object({
  request_id: z.string().nullable(),
  data: HotelSchema.nullable()
});

export const HotelSearchResponseSchema = createResponseWithCountSchema(HotelSchema);

 
// Export types
export type HotelSearchResponse = z.infer<typeof HotelSearchResponseSchema>;
export type Rate = z.infer<typeof RateSchema>;
export type RoomImage = z.infer<typeof RoomImageSchema>;
export type HotelRoom = z.infer<typeof HotelRoomSchema>;
export type HotelResult = z.infer<typeof HotelSchema>;
export type HotelResponse = z.infer<typeof HotelResponseSchema>;
export type HotelAddress = z.infer<typeof HotelAddressSchema>;
export type HotelContact = z.infer<typeof HotelContactSchema>;
export type Offer = z.infer<typeof OfferSchema>;