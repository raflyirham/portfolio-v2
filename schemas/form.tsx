import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(50, {
    message: "Name must be less than 50 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }).max(100, {
    message: "Email must be less than 100 characters.",
  }),
  message: z
    .string()
    .min(1, { message: "Message is required." })
    .max(500, { message: "Message must be less than 500 characters." }),
  recaptcha: z.string().refine((val) => val.length > 0, {
    message: "Captcha is required.",
  }),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
