import { z } from 'zod';

export const BaseResponseSchema = z.object({
  request_id: z.string().optional(),
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

export const  createResponseWithCountSchema = <T extends z.ZodType>(schema: T) => {
  return BaseResponseSchema.extend({
    results: z.array(schema),
  });
};

