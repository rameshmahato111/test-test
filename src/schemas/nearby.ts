import { z } from "zod";
import { createResponseWithCountSchema } from "./common";

const NearbySchema = z.object({
  currency: z.string(),
  id: z.number(),
  image: z.string(),
  location: z.string(), 
  minPrice: z.number().or(z.string()),
  name: z.string(),
  type: z.string(),
  originalPrice: z.number().nullable(),
  farePrice: z.number().nullable(),
})

export const NearbyResponseSchema= createResponseWithCountSchema(NearbySchema);
export type NearbyResponse = z.infer<typeof NearbyResponseSchema>;

export type Nearby = z.infer<typeof NearbySchema>;