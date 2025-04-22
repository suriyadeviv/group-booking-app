import { z } from 'zod';
import { contactSchema } from './contactSchema';
import { bookingSchema } from './bookingSchema';
import { roomSchema } from './roomSchema';

export const formSchema = contactSchema.merge(bookingSchema).merge(roomSchema).refine((data) => {
    if (data.bookerType !== "personal" && !data.companyName?.trim()) {
      return false;
    }
    return true;
  }, {
    message: "Company name is required",
    path: ["companyName"],
  });
export type FormData = z.infer<typeof formSchema>;
