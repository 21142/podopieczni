import * as z from 'zod';
import { checkNIP } from '../checkNIP';

export const shelterSettingsSchema = z.object({
  name: z.string(),
  website: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional().nullable(),
  phoneNumber: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Email is invalid' })
    .optional()
    .refine((value) => {
      return value === '-' || typeof value === 'string';
    }),
  taxId: z.string().refine(
    async (value) => {
      const onlyDigits = value.replace(/-/g, '');
      if (onlyDigits.length !== 10 || !/^\d+$/.test(onlyDigits)) {
        return false;
      }
      return await checkNIP(onlyDigits);
    },
    {
      message: 'Invalid NIP or NIP not registered',
    }
  ),
  address: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export const shelterFilterOptionsSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  sortBy: z.string().optional(),
});

export type IShelterSettings = z.infer<typeof shelterSettingsSchema>;
export type IShelterFilterOptions = z.infer<typeof shelterFilterOptionsSchema>;
