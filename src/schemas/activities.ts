import { z } from 'zod';
import { createResponseWithCountSchema } from './common';

export const CountryDestinationSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const ImageUrlSchema = z.object({
  dpi: z.number(),
  height: z.number(),
  width: z.number(),
  resource: z.string().url(),
  sizeType: z.string(),
});

export const ActivityImageSchema = z.object({
  visualizationOrder: z.number(),
  mimeType: z.string(),
  language: z.string(),
  urls: z.array(ImageUrlSchema),
});

export const AmountSchema = z.object({
  paxType: z.string(),
  ageFrom: z.number(),
  ageTo: z.number(),
  amount: z.number().or(z.string()),
  boxOfficeAmount: z.number().or(z.string()),
  mandatoryApplyAmount: z.boolean(),
  originalPrice: z.number().nullable(),
  farePrice: z.number().nullable(),
});

export const ModalitySchema = z.object({
  id: z.number(),
  name: z.string(),
  duration: z.object({
    value: z.number(),
    metric: z.string(),
  }),
  destinationCode: z.string(),
  languages: z.array(z.string()),
  questions: z.array(z.object({
    code: z.string(),
    text: z.string(),
    required: z.boolean(),
  })).optional().nullable(),
  amountsFrom: z.array(AmountSchema),
  rates: z.array(z.object({
    id: z.number(),
    rateCode: z.string(),
    rateClass: z.string(),
    freeCancellation: z.boolean(),
    rateDetails: z.array(z.object({
      id: z.number(),
      operationDates: z.array(z.object({
        from: z.string(),
        to: z.string(),
        cancellationPolicies: z.array(z.object({
          dateFrom: z.string(),
          amount: z.number().or(z.string()),
        })),
      })),
      languages: z.array(z.any()).default([]),
      sessions: z.array(z.object({
        code: z.string(),
        name: z.string(),
      })),
      minimumDuration: z.object({
        value: z.number(),
        metric: z.string(),
      }),
      maximumDuration: z.object({
        value: z.number(),
        metric: z.string(),
      }),
      totalAmount: z.object({
        amount: z.number().or(z.string()),
        boxOfficeAmount: z.number().or(z.string()),
        mandatoryApplyAmount: z.boolean(),
        originalPrice: z.number().nullable(),
        farePrice: z.number().nullable(),
      }),
      paxAmounts: z.array(AmountSchema),
    })),
  })),
  amountUnitType: z.string(),
  uniqueIdentifier: z.string(),
});

export const ActivityLocationSchema = z.object({
  endPoints: z.array(z.object({
    type: z.string(),
    description: z.string(),
  })),
  startingPoints: z.array(z.object({
    type: z.string().optional(),
    meetingPoint: z.object({
      type: z.string(),
      country: z.object({
        code: z.string(),
        name: z.string(),
        destinations: z.array(CountryDestinationSchema),
      }),
      description: z.string(),
    }),
    pickupInstructions: z.array(z.object({
      description: z.string().optional(),
    })).optional(),
  })),
});

export const ActivitySchema = z.object({
  request_id: z.string().optional(),
  id: z.string(),
  name: z.string(),
  type: z.string(),
  paxes: z.array(z.number()),
  from_date: z.string(),
  to_date: z.string(),
  currency: z.string(),
  description: z.string(),
  avg_rating: z.number(),
  country: z.object({
    code: z.string(),
    name: z.string(),
    destinations: z.array(CountryDestinationSchema),
  }),
  operationDays: z.array(z.object({
    code: z.string(),
    name: z.string(),
  })),
  modalities: z.array(ModalitySchema),
  currencyName: z.string(),
  amountsFrom: z.array(AmountSchema),
  images: z.array(ActivityImageSchema),
  location: ActivityLocationSchema,
  importantInfo: z.array(z.string()),
  notes: z.array(z.object({
    dateFrom: z.string(),
    dateTo: z.string(),
    visibleFrom: z.string(),
    visibleTo: z.string(),
    descriptions: z.array(z.object({
      description: z.string(),
    })),
  })),
  extraInfo: z.object({
    guidingOptions: z.object({
      guideType: z.string().optional(),
      included: z.boolean().optional(),
    }).optional(),
    featureGroups: z.array(z.object({
      groupCode: z.string(),
      included: z.array(z.object({
        featureType: z.string(),
        description: z.string(),
      })).optional(),
      excluded: z.array(z.object({
        featureType: z.string(),
        description: z.string(),
      })).optional(),
    })),
    detailedInfo: z.array(z.record(z.string(), z.any())),
    redeemInfo: z.object({
      type: z.string(),
      directEntrance: z.boolean(),
      comments: z.array(z.object({
        description: z.string(),
      })),
    }),
    routes: z.array(z.record(z.string(), z.any())),
    scheduling: z.record(z.string(), z.any()),
    segmentationGroups: z.array(z.object({
      code: z.number(),
      name: z.string(),
      segments: z.array(z.object({
        code: z.number(),
        name: z.string(),
      })),
    })),
  }),
}); 

export const ActivityResponseSchema = z.object({
  request_id: z.string().nullable(),
  data: ActivitySchema.nullable()
});

export const ActivitiesResponseSchema = createResponseWithCountSchema(ActivitySchema);


export type ActivityResponse = z.infer<typeof ActivityResponseSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type Modalities = z.infer<typeof ModalitySchema>;

export type ActivityLocation = z.infer<typeof ActivityLocationSchema>;


export type ActivityResponseWithCount = z.infer<typeof ActivitiesResponseSchema>;