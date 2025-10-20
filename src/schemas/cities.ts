import { z } from "zod";
import { createResponseWithCountSchema } from "./common";



export const CitySchema = z.object({
    id: z.number({
        message: 'City id is required and must be a number',
    }),
    name: z.string({
        message: 'City name is required and must be a string',
    }),
    country_name: z.string({
        message: 'Country name is required and must be a string',
    }),
    country_code: z.string({
        message: 'Country code is required and must be a string',
    }),
    coordinates: z.array(z.number()).optional(),
    image: z.string({
        message: 'Image is required and must be a string',
    }).nullable(),
  });


export const CategoryActivitySchema = z.object({
    id: z.number({
        message: 'Activity id is required and must be a number',
    }),
    name: z.string({
        message: 'Activity name is required and must be a string',
    }),
    image: z.string({
        message: 'Image is required and must be a string',
    }),
    type: z.string({
        message: 'Type is required and must be a string',
    }),
    location: z.string({
        message: 'Location is required and must be a string',
    }),
    minPrice: z.string({
        message: 'Minimum price is required and must be a number',
    }),
    currency: z.string({
        message: 'Currency is required and must be a string',
    }),
    originalPrice: z.string().nullable(),
    farePrice: z.string().nullable(),
});
export const CityResponseSchema = createResponseWithCountSchema(CitySchema);

export const CategoryActivityResponseSchema = createResponseWithCountSchema(CategoryActivitySchema);
export type CategoryActivityResponse = z.infer<typeof CategoryActivityResponseSchema>;

export type CategoryActivity = z.infer<typeof CategoryActivitySchema>;
export type CityResponse = z.infer<typeof CityResponseSchema>;
export type City = z.infer<typeof CitySchema>;