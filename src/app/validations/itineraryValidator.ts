import { z } from "zod"

// Step 1 validation schema
export const stepOneSchema = z.object({
  starting_location: z.string().min(1, "Please select a starting location"),
  destination_location: z.string().min(1, "Please select a destination location"),
  starting_date: z.string().min(1, "Please select a starting date"),
  ending_date: z.string().min(1, "Please select an ending date"),
  starting_point: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  destination_point: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  daily_drive_distance: z.string().optional(),
})

// Step 2 validation schema
export const stepTwoSchema = z.object({
  travel_group_type: z.string().min(1, "Please select a travel group type"),
  mode_of_transport: z.string().min(1, "Please select a mode of transport"),
  travelers_count: z.number().min(1, "Number of travelers must be at least 1"),
  number_of_rooms: z.number().min(1, "Number of rooms must be at least 1").optional(),
})

// Step 3 validation schema
export const stepThreeSchema = z.object({
  interests: z.string().min(1, "Please select at least 3 interests"),
  budget: z.string().min(1, "Please select a budget option"),
})

// Combined validation schema for the entire form
export const itineraryFormSchema = z.object({
  // Step 1 fields
  starting_location: z.string().min(1, "Please select a starting location"),
  destination_location: z.string().min(1, "Please select a destination location"),
  starting_date: z.string().min(1, "Please select a starting date"),
  ending_date: z.string().min(1, "Please select an ending date"),
  starting_point: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  destination_point: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  daily_drive_distance: z.string().optional(),
  
  // Step 2 fields
  travel_group_type: z.string().min(1, "Please select a travel group type"),
  mode_of_transport: z.string().min(1, "Please select a mode of transport"),
  travelers_count: z.number().min(1, "Number of travelers must be at least 1"),
  number_of_rooms: z.number().min(1, "Number of rooms must be at least 1").optional(),
  
  // Step 3 fields
  interests: z.string().min(1, "Please select at least 3 interests"),
  budget: z.string().min(1, "Please select a budget option"),
})

export type StepOneFormData = z.infer<typeof stepOneSchema>
export type StepTwoFormData = z.infer<typeof stepTwoSchema>
export type StepThreeFormData = z.infer<typeof stepThreeSchema>
export type ItineraryFormData = z.infer<typeof itineraryFormSchema>
