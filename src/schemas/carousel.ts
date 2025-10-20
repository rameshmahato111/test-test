import { z } from "zod";

export const carouselSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().url(),
  carousel_type: z.string(),
  data: z.object({
    type: z.string().optional(),
    price: z.string().optional(),
    currency: z.string().optional(),
    duration: z.string().optional(),
    object_id: z.number().optional()
  }).default({})
})

export const carouselResponseSchema = z.array(carouselSchema)

export type CarouselResponse = z.infer<typeof carouselResponseSchema>

export type Carousel = z.infer<typeof carouselSchema>

