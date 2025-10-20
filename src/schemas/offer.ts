
import { z } from "zod";

 const OfferSchema = z.object({
    id: z.number(),
    name: z.string(),
    object_id: z.number(),
    description: z.string(),
    discount_percentage: z.number(),
    start_date: z.string(),
    end_date: z.string(),
    content_type: z.number(),
})

export const OfferResponseSchema = z.array(OfferSchema);

export type OfferResponse = z.infer<typeof OfferResponseSchema>;