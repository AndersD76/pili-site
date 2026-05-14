import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  company: z.string().min(2).max(120),
  cnpj: z.string().optional(),
  country: z.string().length(2).default("BR"),
  state: z.string().optional(),
  city: z.string().optional(),
  role: z.string().optional(),
  application: z
    .enum([
      "porto",
      "cooperativa",
      "industria",
      "fertilizante",
      "cimento",
      "outro",
    ])
    .optional(),
  productInterest: z.string().optional(),
  grainType: z.string().optional(),
  truckVolume: z.coerce.number().int().min(0).optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, {
    message: "Aceite a política de privacidade",
  }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const catalogSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().min(2).max(120),
  country: z.string().length(2).default("BR"),
});

export type CatalogInput = z.infer<typeof catalogSchema>;
