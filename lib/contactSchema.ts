import { z } from 'zod';

export const contactSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long"),
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email too long")
});

export type ContactFormData = z.infer<typeof contactSchema>;