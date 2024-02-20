import * as z from 'zod';

export const petDetailsSchema = z.object({
  internalId: z.string().optional(),
  image: z.string().optional(),
  name: z.string().optional(),
  species: z.string().optional(),
  breed: z.string().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  coat: z.string().optional(),
  weight: z.string().optional(),
  dateOfBirth: z.string().optional(),
  status: z.string().optional(),
  microchipBrand: z.string().optional(),
  microchipNumber: z.string().optional(),
  healthStatus: z.union([
    z.literal('HEALTHY'),
    z.literal('INJURED'),
    z.literal('SICK'),
    z.literal('TREATED'),
    z.literal('QUARANTINE'),
    z.literal('DEAD'),
  ]),
  intakeEventDate: z.string().optional(),
  intakeEventType: z.union([
    z.literal('STRAY'),
    z.literal('TRANSFER'),
    z.literal('SURRENDER'),
    z.literal('BORN'),
    z.literal('RETURN'),
    z.literal('OTHER'),
  ]),
});

export const petFilterOptionsSchema = z.object({
  name: z.string().optional(),
  species: z.string().optional(),
  breed: z.string().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  coat: z.string().optional(),
  weight: z.string().optional(),
  age: z.string().optional(),
  size: z.string().optional(),
  characteristics: z.string().optional(),
  goodWith: z.string().optional(),
  status: z.string().optional(),
  healthStatus: z.union([
    z.literal('HEALTHY'),
    z.literal('INJURED'),
    z.literal('SICK'),
    z.literal('TREATED'),
    z.literal('QUARANTINE'),
    z.literal('DEAD'),
  ]),
});

export const fullPetDetailsSchema = z.object({
  internalId: z.string().optional(),
  image: z.string().optional(),
  name: z.string().optional(),
  species: z.string().optional(),
  breed: z.string().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  coat: z.string().optional(),
  weight: z.string().optional(),
  adoptionFee: z.number().optional(),
  dateOfBirth: z.string().optional(),
  status: z.string().optional(),
  microchipBrand: z.string().optional(),
  microchipNumber: z.string().optional(),
  description: z.string().optional(),
  houseTrained: z.boolean().optional(),
  specialNeeds: z.boolean().optional(),
  neutered: z.boolean().optional(),
  declawed: z.boolean().optional(),
  aggressive: z.boolean().optional(),
  friendlyWithDogs: z.boolean().optional(),
  friendlyWithCats: z.boolean().optional(),
  friendlyWithChildren: z.boolean().optional(),
  shelter: z.object({}).optional(),
  shelterId: z.string().optional(),
  healthStatus: z.union([
    z.literal('HEALTHY'),
    z.literal('INJURED'),
    z.literal('SICK'),
    z.literal('TREATED'),
    z.literal('QUARANTINE'),
    z.literal('DEAD'),
  ]),
  medicalEvents: z.array(z.object({})).optional(),
  intakeEventDate: z.string().optional(),
  intakeEventType: z.union([
    z.literal('STRAY'),
    z.literal('TRANSFER'),
    z.literal('SURRENDER'),
    z.literal('BORN'),
    z.literal('RETURN'),
    z.literal('OTHER'),
  ]),
  outcomeEvents: z.array(z.object({})).optional(),
  photos: z.array(z.object({})).optional(),
  documents: z.array(z.object({})).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const petIdSchema = z.object({
  id: z.string(),
});

export type IPetDetails = z.infer<typeof petDetailsSchema>;
export type IPetFullDetails = z.infer<typeof fullPetDetailsSchema>;
export type IPetFilterOptions = z.infer<typeof petFilterOptionsSchema>;
