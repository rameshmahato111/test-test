import {z} from 'zod';
import { createResponseWithCountSchema } from './common';

// Schema for item details
const ItemDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['hotel', 'activity']),
  image: z.string().url(),
});

// Schema for individual wishlist item
export const WishlistItemSchema = z.object({
  id: z.number(),
  user: z.number(),
  content_type: z.enum(['HOTEL', 'ACTIVITY']),
  object_id: z.number(),
  item_details: ItemDetailsSchema,
});


const CreateBucketlistSchema = z.object({
    name: z.string(),
    description: z.string().optional().nullable(),
    cover_image: z.string().optional().nullable(),
})


export const BucketListWithItemsSchema = z.object({
   bucket_list:z.object({
    id:z.number(),
    name:z.string(),
    description:z.string().optional().nullable(),
    cover_image:z.string().optional().nullable(),
    created_at:z.string().datetime(),
    updated_at:z.string().datetime(),
    wishlist_items:WishlistItemSchema.array()
   }),
  
})


export const BucketListResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(), 
  item_count: z.number()
})


export type BucketListResponse = z.infer<typeof BucketListResponseSchema>
export type BucketlistResponse = z.infer<typeof BucketListWithItemsSchema>
export type CreateBucketlist = z.infer<typeof CreateBucketlistSchema>

// Schema for the paginated response
export const WishlistResponseSchema = createResponseWithCountSchema(WishlistItemSchema);
export const BucketListWithItemResponseSchema = z.object({
   bucket_list:z.object({
    id:z.number(),
    name:z.string(),
    description:z.string().optional().nullable(),
    cover_image:z.string().optional().nullable(),
    created_at:z.string().datetime(),
    updated_at:z.string().datetime(),
    wishlist_items:WishlistItemSchema.array()
   })
})
// Type inference
export type BucketListWithItemResponse = z.infer<typeof BucketListWithItemResponseSchema>;
export type WishlistResponse = z.infer<typeof WishlistResponseSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type ItemDetails = z.infer<typeof ItemDetailsSchema>;
