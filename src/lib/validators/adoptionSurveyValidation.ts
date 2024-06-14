import * as z from 'zod';

export const adoptionSurveySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Email is invalid' }),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .max(13, 'Phone number is invalid'),
  address: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
  householdSize: z.union([z.literal('Dom'), z.literal('Mieszkanie')]),
  hasPets: z.string(),
  hasChildren: z.string(),
  reasonForAdoption: z.string(),
  experience: z.string(),
});

export type IAdoptionSurvey = z.infer<typeof adoptionSurveySchema>;
