import { type Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let searchQuery = req.query.search;
    if (Array.isArray(searchQuery)) {
      searchQuery = searchQuery.join(' ');
    }
    let availableAnimals;
    if (searchQuery) {
      availableAnimals = await prisma.pet.findMany({
        where: {
          availableForAdoption: true,
          OR: [
            {
              name: { contains: searchQuery },
              shelter: {
                OR: [
                  { name: { contains: searchQuery } },
                  {
                    address: {
                      OR: [
                        {
                          address: {
                            contains: searchQuery,
                          },
                        },
                        {
                          city: { contains: searchQuery },
                        },
                        {
                          state: { contains: searchQuery },
                        },
                        {
                          country: {
                            contains: searchQuery,
                          },
                        },
                        {
                          postCode: {
                            contains: searchQuery,
                          },
                        },
                      ],
                    },
                  },
                ] as Prisma.ShelterWhereInput[],
              },
            },
            { age: { contains: searchQuery } },
            { species: { contains: searchQuery } },
            { breed: { contains: searchQuery } },
            { color: { contains: searchQuery } },
            { coat: { contains: searchQuery } },
            { gender: { contains: searchQuery } },
          ],
        },
        include: {
          shelter: {
            include: {
              address: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      availableAnimals = await prisma.pet.findMany({
        where: {
          availableForAdoption: true,
        },
        include: {
          shelter: {
            include: {
              address: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    res.status(200).json(availableAnimals);
    return availableAnimals;
  } catch (error) {
    console.log('Error fetching animal data:', error);
    res.status(500).json({ error: 'Could not load pets' });
  }
};

export default handler;
