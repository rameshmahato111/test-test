import { z } from "zod";

export const interestSchema = z.object({
  id: z.number(),
  user: z.number(),
  segment: z.array(z.number()),
})

export const choiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  categories:z.array(z.number()).optional().nullable(),
})

export const choiceResponseSchema = z.array(choiceSchema);

export type InterestResponse = z.infer<typeof interestSchema>;
export type ChoiceResponse = z.infer<typeof choiceResponseSchema>;