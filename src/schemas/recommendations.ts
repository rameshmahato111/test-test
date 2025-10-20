import { z } from 'zod';
import { createResponseWithCountSchema } from './common';

 const RecommendationSchema = z.object({
  id: z.number(),
  image: z.string(),
  type: z.string(),
  location: z.string(),
  minPrice: z.string().or(z.number()),
  currency: z.string(),
  name: z.string(),
  originalPrice: z.string().nullable(),
  farePrice: z.string().nullable(),
});

export const RecommendationResponseSchema = createResponseWithCountSchema(RecommendationSchema);
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;

export type Recommendation = z.infer<typeof RecommendationSchema>;