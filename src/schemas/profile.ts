import { nullable, z } from "zod";
import { createResponseWithCountSchema } from "./common";

const myReviewSchema = z.object({
    id: z.number(),
    comment: z.string(),
    content_type: z.string(),
    created_at: z.string(),
    dislike_count: z.number(),
    like_count: z.number(),
    object_id: z.number(),
    rating: z.number(),
    updated_at: z.string(),
    images: z.array(z.object({
        id: z.number(),
        image: z.string(),
        caption: z.string().optional().nullable(),
    })).optional(),
})
export const myReviewResponseSchema = createResponseWithCountSchema(myReviewSchema);

export type MyReviewResponse = z.infer<typeof myReviewResponseSchema>;

export type MyReview = z.infer<typeof myReviewSchema>;
