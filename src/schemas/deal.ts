import { z } from "zod";
import { createResponseWithCountSchema } from "./common";

 export const DealSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string().nullable(),
    type: z.string(),
   location: z.string(),
   originalPrice: z.string().or(z.number()),
   farePrice: z.string().or(z.number()),
   currency: z.string(),
   exchangeRate: z.number().nullable(),
   minPrice: z.string().or(z.number()),
   discountPCT: z.number(),
  
    
 })

 export type Deal = z.infer<typeof DealSchema>;

 export const DealResponseSchema = createResponseWithCountSchema(DealSchema);
 export type DealResponse = z.infer<typeof DealResponseSchema>;