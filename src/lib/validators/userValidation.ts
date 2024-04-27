import * as z from 'zod';

export const userAccountDetailsSchema = z.object({
  title: z.string().optional().nullable(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Email is invalid' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .max(13, 'Phone number is invalid'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
  role: z.union([
    z.literal('Adopter'),
    z.literal('Shelter'),
    z.literal('Admin'),
  ]),
  image: z.string().optional(),
});

export const userEmailInviteSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Email is invalid' }),
});

export type IUserAccountDetails = z.infer<typeof userAccountDetailsSchema>;
export type IUserInviteDetails = z.infer<typeof userEmailInviteSchema>;
