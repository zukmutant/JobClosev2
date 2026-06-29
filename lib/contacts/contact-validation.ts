import { z } from "zod";

export const createContactInputSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
    companyName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    companyCode: z.string().optional(),
    vatCode: z.string().optional(),
    phoneSmsEnabled: z.boolean().optional(),
    phoneWhatsappEnabled: z.boolean().optional(),
    phoneTelegramEnabled: z.boolean().optional(),
  })
  .strict();

export const preparedContactCreateInputSchema = createContactInputSchema
  .extend({
    firstNameNormalized: z.string().optional(),
    lastNameNormalized: z.string().optional(),
    displayNameNormalized: z.string().optional(),
    companyNameNormalized: z.string().optional(),
    emailNormalized: z.string().optional(),
    emailDomain: z.string().optional(),
    phoneE164: z.string().optional(),
    phoneRegion: z.string().optional(),
    companyCodeNormalized: z.string().optional(),
    vatCodeNormalized: z.string().optional(),
  })
  .strict();

export type CreateContactInputPayload = z.infer<typeof createContactInputSchema>;
