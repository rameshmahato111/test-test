import { z } from "zod";
import { createResponseWithCountSchema } from "./common";

// Base booking schema for common fields
const baseBookingSchema = z.object({
  id: z.number(),
  reference_code: z.string(),
  object_id: z.number(),
  client_reference: z.string(),
  status: z.string(),
  creation_date: z.string(),
  check_in: z.string(),
  check_out: z.string(),
  is_cancellable: z.boolean(),
  total_net: z.string(),
  currency: z.string(),
  remark: z.string().nullable(),
  user: z.number(),
  supplier: z.number(),
});

// URL Schema
const urlSchema = z.object({
  dpi: z.number(),
  width: z.number(),
  height: z.number(),
  resource: z.string().url(),
  sizeType: z.string(),
});

// Image Schema
const imageSchema = z.object({
  urls: z.array(urlSchema),
  language: z.string(),
  mimeType: z.string(),
  visualizationOrder: z.number(),
});

// Media Schema
const mediaSchema = z.object({
  images: z.array(imageSchema).optional(),
});

// Location Schema
const countrySchema = z.object({
  code: z.string(),
  name: z.string(),
  destinations: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

const meetingPointSchema = z.object({
  type: z.string(),
  country: countrySchema.optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

// Pax Schema
const paxSchema = z.object({
  age: z.number(),
  name: z.string(),
  mailing: z.boolean(),
  paxType: z.string(),
  surname: z.string(),
  passport: z.string(),
  customerId: z.string(),
});

// Content Schema
const contentSchema = z
  .object({
    name: z.string(),
    media: mediaSchema.optional(),
    routes: z.array(z.any()),
    language: z.string(),
    location: z
      .object({
        endPoints: z.array(
          z.object({
            type: z.string(),
            description: z.string(),
          })
        ),
        startingPoints: z.array(
          z.object({
            type: z.string(),
            meetingPoint: meetingPointSchema,
          })
        ),
      })
      .optional(),
    description: z.string().optional(),
    summary: z.string().optional(),
    highligths: z.array(z.string()).optional(),
    importantInfo: z.array(z.string()).optional(),
  })
  .passthrough(); // Using passthrough for other optional fields

// Extra Schema
const extraSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    type: z.string(),
    paxes: z.array(paxSchema),
    dateTo: z.string(),
    dateFrom: z.string(),
    status: z.string(),
    content: contentSchema.optional(),
    comments: z.array(
      z.object({
        text: z.string(),
        type: z.string(),
      })
    ),
    modality: z
      .object({
        code: z.string(),
        name: z.string(),
        amountUnitType: z.string(),
      })
      .passthrough(),
    amountDetail: z.object({
      paxAmounts: z.array(
        z.object({
          amount: z.number(),
          paxType: z.string(),
          ageTo: z.number().optional(),
          ageFrom: z.number().optional(),
        })
      ),
      totalAmount: z.object({
        amount: z.number(),
      }),
    }),
  })
  .passthrough();

// Activity Booking specific schemas
const activityPaxSchema = z.object({
  age: z.number(),
  name: z.string(),
  mailing: z.boolean(),
  paxType: z.string(),
  surname: z.string(),
  passport: z.string(),
  customerId: z.string(),
});

const activityInfoSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    type: z.string(),
    paxes: z.array(activityPaxSchema),
    dateTo: z.string(),
    dateFrom: z.string(),
    status: z.string(),
    comments: z.array(
      z.object({
        text: z.string(),
        type: z.string(),
      })
    ),
    modality: z
      .object({
        code: z.string(),
        name: z.string(),
        amountUnitType: z.string(),
      })
      .passthrough(),
    supplier: z.object({
      name: z.string(),
      vatNumber: z.string(),
    }),
    amountDetail: z.object({
      paxAmounts: z.array(
        z.object({
          amount: z.number(),
          paxType: z.string(),
        })
      ),
      totalAmount: z.object({
        amount: z.number(),
      }),
    }),
    cancellationPolicies: z
      .array(
        z.object({
          amount: z.number(),
          dateFrom: z.string(),
        })
      )
      .optional(),
  })
  .passthrough();

const activityExtraSchema = z
  .object({
    image: z.string().url(),
    activity_info: z.array(activityInfoSchema),
  })
  .passthrough();

// Update the activity booking holder schema
const activityBookingHolderSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  title: z.string(),
  mailing: z.boolean(),
  surname: z.string(),
  telephones: z.array(z.string()).nullable().optional(),
});

// Update the activity booking schema
export const activityBookingSchema = baseBookingSchema.extend({
  booking_type: z.literal("ACTIVITY"),
  holder: activityBookingHolderSchema,
  extras: activityExtraSchema,
});

// Update the tax schema
const taxSchema = z.object({
  amount: z.string(),
  currency: z.string(),
  included: z.boolean(),
  // clientAmount: z.string(),
  // clientCurrency: z.string()
});

// Update the rate schema
const rateSchema = z.object({
  net: z.string(),
  rooms: z.number(),
  taxes: z
    .object({
      taxes: z.array(taxSchema).optional(),
      allIncluded: z.boolean(),
    })
    .optional(),
  adults: z.number(),
  children: z.number(),
  boardCode: z.string(),
  boardName: z.string(),
  packaging: z.boolean(),
  rateClass: z.string(),
  paymentType: z.string(),
  rateComments: z.string().optional(),
  rateBreakDown: z
    .object({
      rateDiscounts: z
        .array(
          z.object({
            code: z.string(),
            name: z.string(),
            amount: z.string(),
          })
        )
        .optional(),
      rateSupplements: z
        .array(
          z.object({
            to: z.string().optional(),
            code: z.string(),
            from: z.string().optional(),
            name: z.string(),
            amount: z.string(),
            nights: z.number().optional(),
            paxNumber: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  cancellationPolicies: z.array(
    z.object({
      from: z.string(),
      amount: z.string(),
    })
  ),
});

// Update hotel room schema
const hotelRoomSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  paxes: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      roomId: z.number(),
      surname: z.string(),
    })
  ),
  rates: z.array(rateSchema),
  status: z.string(),
  supplierReference: z.string().optional(),
});

// Update hotel info schema
const hotelInfoSchema = z.object({
  code: z.number(),
  name: z.string(),
  rooms: z.array(hotelRoomSchema),
  checkIn: z.string(),
  checkOut: z.string(),
  currency: z.string(),
  latitude: z.string(),
  supplier: z.object({
    name: z.string(),
    vatNumber: z.string(),
  }),
  totalNet: z.string(),
  zoneCode: z.number(),
  zoneName: z.string(),
  longitude: z.string(),
  categoryCode: z.string(),
  categoryName: z.string(),
  destinationCode: z.string(),
  destinationName: z.string(),
});

// Update hotel extras schema
const hotelExtrasSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  hotelInfo: hotelInfoSchema.optional(),
});

// Update hotel booking schema
export const hotelBookingSchema = baseBookingSchema.extend({
  booking_type: z.literal("HOTEL"),
  holder: z.object({
    name: z.string(),
    email: z.string().optional(), // Made optional since some responses don't have it
    surname: z.string(),
    phone_number: z.string(),
  }),
  extras: z.any(),
  reference_code: z.string(),
  object_id: z.number(),
  client_reference: z.string(),
  status: z.string(),
  creation_date: z.string(),
  check_in: z.string(),
  check_out: z.string(),
  total_net: z.string(),
  currency: z.string(),
  remark: z.string().nullable(),
  user: z.number(),
  supplier: z.number(),
});

export type ActivityBooking = z.infer<typeof activityBookingSchema>;
export type HotelBooking = z.infer<typeof hotelBookingSchema>;

export const HotelBookingResponseSchema =
  createResponseWithCountSchema(hotelBookingSchema);
export type HotelBookingResponse = z.infer<typeof HotelBookingResponseSchema>;

export const ActivityBookingResponseSchema = createResponseWithCountSchema(
  activityBookingSchema
);
export type ActivityBookingResponse = z.infer<
  typeof ActivityBookingResponseSchema
>;
