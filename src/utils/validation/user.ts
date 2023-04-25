import * as z from 'zod';

export const userAccountDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Email is invalid' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postCode: z.string().min(1, 'Post code is required'),
  country: z.string().min(1, 'Country is required'),
  role: z.union([
    z.literal('Adopter'),
    z.literal('Shelter'),
    z.literal('Admin'),
  ]),
});

export type IUserAccountDetails = z.infer<typeof userAccountDetailsSchema>;
