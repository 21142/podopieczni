import { type Prisma } from '@prisma/client';

export const petsSearchWhereConditions = (
  searchQuery: string
): Prisma.PetWhereInput => {
  return {
    availableForAdoption: true,
    OR: [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      {
        shelter: {
          OR: [
            {
              address: {
                OR: [
                  { address: { contains: searchQuery, mode: 'insensitive' } },
                  { city: { contains: searchQuery, mode: 'insensitive' } },
                  { state: { contains: searchQuery, mode: 'insensitive' } },
                  { country: { contains: searchQuery, mode: 'insensitive' } },
                  { postCode: { contains: searchQuery, mode: 'insensitive' } },
                ],
              },
            },
          ],
        },
      },
      { species: { contains: searchQuery, mode: 'insensitive' } },
      { breed: { contains: searchQuery, mode: 'insensitive' } },
      { color: { contains: searchQuery, mode: 'insensitive' } },
      { coat: { contains: searchQuery, mode: 'insensitive' } },
      { gender: { contains: searchQuery, mode: 'insensitive' } },
    ],
  };
};

export const sheltersSearchWhereConditions = (
  searchQuery: string
): Prisma.ShelterWhereInput => {
  return {
    OR: [
      {
        name: { contains: searchQuery },
      },
      {
        description: { contains: searchQuery },
      },
      {
        address: {
          OR: [
            { address: { contains: searchQuery } },
            { city: { contains: searchQuery } },
            { state: { contains: searchQuery } },
            { country: { contains: searchQuery } },
            { postCode: { contains: searchQuery } },
          ],
        },
      },
    ],
  };
};
