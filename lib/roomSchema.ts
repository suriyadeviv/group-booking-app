import { z } from 'zod';

export const roomSchema = z.object({
  roomCount: z.record(
    z.number()
      .min(0, "Cannot be negative")
      .max(10, "Maximum 10 rooms per type")
  ).superRefine((val, ctx) => {
    const totalRooms = Object.values(val).reduce((sum, count) => sum + count, 0);
    if (totalRooms < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum 10 rooms required for group booking",
      });
    }
  }),
});

export type RoomFormData = z.infer<typeof roomSchema>;
