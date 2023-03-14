import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Email is invalid' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, { message: 'Password has to be at least 8 characters long' })
    .max(64, { message: 'Password has to be at most 64 characters long' }),
});

export const signUpSchema = loginSchema.extend({
  name: z.string({
    required_error: 'Email is required',
  }),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
