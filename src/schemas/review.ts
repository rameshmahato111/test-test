import { z } from "zod";
import { createResponseWithCountSchema } from "./common";


export const reviewStatsSchema = z.object({
    total_likes: z.number({
        message: "Total likes must be a number"
    }),
    total_dislikes: z.number({
        message: "Total dislikes must be a number"
    }),
    total_reviews: z.number({
        message: "Total reviews must be a number"
    }),
    average_rating: z.number({
        message: "Average rating must be a number"
    }),
    rating_distribution: z.record(z.string({
        message: "Rating distribution Key must be a string"
    }), z.number({
        message: "Rating distribution Value must be a number"
    })),
})


export const ReviewSchema = z.object({
    id: z.number(),
    user: z.object({
        id: z.number(),
        username: z.string(),
        full_name: z.string().nullable(),
        profile_picture: z.string().nullable()
    }),
    content_type: z.object({
        type: z.string(),
        listing: z.object({
            id: z.number(),
            name: z.string()
        })
    }),
    rating: z.number(),
    comment: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    images: z.array(z.object({
        caption: z.string().nullable().optional(),
        id: z.number(),
        image: z.string()
    })),
    like_count: z.number().optional(),
    dislike_count: z.number().optional()
})

export const ReviewResponseSchema = createResponseWithCountSchema(ReviewSchema);
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type Review = z.infer<typeof ReviewSchema>;

export type ReviewStatsResponse = z.infer<typeof reviewStatsSchema>;