import * as z from "zod";

export const appointmentFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email().optional().or(z.literal("")),
  serviceId: z.string().min(1, { message: "Please select a service" }),
  branchId: z.string().min(1, { message: "Please select a branch" }),
  date: z.date({ required_error: "Please select a date and time" }),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal(""))
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
