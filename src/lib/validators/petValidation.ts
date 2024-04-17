import * as z from 'zod';

export const medicalEvent = z.object({
  eventDate: z.string(),
  medicalEventType: z.union([
    z.literal('VACCINATION'),
    z.literal('DIAGNOSIS'),
    z.literal('TREATMENT'),
    z.literal('MEDICATION'),
    z.literal('SURGERY'),
  ]),
  knownCost: z.string().optional().nullable(),
  cost: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: 'Cost must be a number',
    })
    .optional(),
});

export const outcomeEvent = z.object({
  eventDate: z.string(),
  eventType: z.union([
    z.literal('ADOPTION'),
    z.literal('TRANSFER'),
    z.literal('EUTHANIZED'),
    z.literal('DIED'),
    z.literal('RETURN'),
  ]),
});

export const document = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string().optional(),
});

export const photo = z.object({
  url: z.string(),
});

export const note = z.object({
  title: z.string().optional(),
  content: z.string().max(500),
});

export const petDetailsSchema = z.object({
  internalId: z.string().optional(),
  image: z.string().optional(),
  name: z.string(),
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
    z.literal('UNKNOWN'),
  ]),
  intakeEventDate: z.string().optional(),
  intakeEventType: z.union([
    z.literal('STRAY'),
    z.literal('TRANSFER'),
    z.literal('SURRENDER'),
    z.literal('BORN'),
    z.literal('RETURN'),
    z.literal('UNKNOWN'),
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
    z.literal('UNKNOWN'),
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
  adoptionFeeKnown: z.boolean().optional(),
  adoptionFee: z.string().optional(),
  dateOfBirth: z.string().optional(),
  status: z.string().optional(),
  microchipBrand: z.string().optional(),
  microchipNumber: z.string().optional(),
  availableForAdoption: z.boolean().optional(),
  description: z.string().optional(),
  houseTrained: z.string().optional().nullable(),
  specialNeeds: z.string().optional().nullable(),
  neutered: z.string().optional().nullable(),
  declawed: z.string().optional().nullable(),
  aggressive: z.string().optional().nullable(),
  friendlyWithDogs: z.string().optional().nullable(),
  friendlyWithCats: z.string().optional().nullable(),
  friendlyWithChildren: z.string().optional().nullable(),
  shelter: z.object({}).optional(),
  shelterId: z.string().optional(),
  healthStatus: z.union([
    z.literal('HEALTHY'),
    z.literal('INJURED'),
    z.literal('SICK'),
    z.literal('TREATED'),
    z.literal('QUARANTINE'),
    z.literal('DEAD'),
    z.literal('UNKNOWN'),
  ]),
  medicalEvents: z.array(medicalEvent).optional(),
  intakeEventDate: z.string().optional(),
  intakeEventType: z.union([
    z.literal('STRAY'),
    z.literal('TRANSFER'),
    z.literal('SURRENDER'),
    z.literal('BORN'),
    z.literal('RETURN'),
    z.literal('UNKNOWN'),
  ]),
  outcomeEvents: z.array(outcomeEvent).optional(),
  photos: z.array(photo).optional(),
  documents: z.array(document).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const idSchema = z.object({
  id: z.string(),
});

export type IPetDetails = z.infer<typeof petDetailsSchema>;
export type IPetFullDetails = z.infer<typeof fullPetDetailsSchema>;
export type IPetFilterOptions = z.infer<typeof petFilterOptionsSchema>;
export type IPetMedicalEvent = z.infer<typeof medicalEvent>;
export type IPetOutcomeEvent = z.infer<typeof outcomeEvent>;
export type IDocument = z.infer<typeof document>;
export type IPhoto = z.infer<typeof photo>;
export type INote = z.infer<typeof note>;
