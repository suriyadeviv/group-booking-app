import { z } from 'zod';

export const bookingSchema = z.object({
  bookerType: z.string().min(1, "Please select a type of booker"),
  companyName: z.string()
    .max(100, "Company name too long")
    .optional(),
  stayPurpose: z.string().min(1, "Please select the nature of your stay"),
  hotel: z.string().min(1, "Please select a hotel"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
