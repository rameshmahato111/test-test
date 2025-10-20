import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  image: z.string().nullable(),
  category_type: z.string(),
  description: z.string().nullable(),
  supplier:z.number(),
 code:z.string(),
})

export const CategoryResponseSchema = z.array(CategorySchema);

export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type Category = z.infer<typeof CategorySchema>;
