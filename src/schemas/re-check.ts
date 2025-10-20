import { z } from "zod";

export const ReCheckAvailabilitySchema = z.object({
  request_id: z.string(),
  hotel_id: z.string(),
  room_id: z.string(),
  rate_id: z.string(),
  data: z.object({
    hasReCheck: z.boolean(),
    net: z.string(),
    originalPrice: z.string(),
    farePrice: z.string(),
    allotment: z.number(),
    cancellationPolicies: z.array(z.object({
      amount: z.string(),
      from: z.string(),
      currency: z.string()
    })),
    promotions: z.array(z.object({
      code: z.string(),
      name: z.string(),
    })).optional().nullable(),
    taxes: z.object({
      taxes: z.array(z.object({
        included: z.boolean(),
        amount: z.number().or(z.string()),
        currency: z.string(),
        clientAmount: z.number().or(z.string()).optional(),
        clientCurrency: z.string().optional(),
      })),
      allIncluded: z.boolean(),
    }).nullable(),
    offers: z.array(z.object({
      code: z.string(),
      name: z.string(),
      amount: z.string(),
      user_currency: z.string().optional()
    })).nullable(),
  })
});

export type ReCheckAvailability = z.infer<typeof ReCheckAvailabilitySchema>;
