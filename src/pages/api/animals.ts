import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
              shelter: {
                OR: [
                  { name: { search: searchQuery } },
                  {
                    address: {
                      OR: [
                        { address: { search: searchQuery } },
                        { city: { search: searchQuery } },
                        { state: { search: searchQuery } },
                        { country: { search: searchQuery } },
                        { postCode: { search: searchQuery } },
                      ],
                    },
                  },
                ],
              },
            },
            { species: { search: searchQuery } },
            { breed: { search: searchQuery } },
            { color: { search: searchQuery } },
            { coat: { search: searchQuery } },
            { gender: { search: searchQuery } },
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
  } catch (error) {
    console.error('Error fetching animal data:', error);
    let errorMessage = 'Could not load data';
    if (error instanceof PrismaClientKnownRequestError) {
      errorMessage = 'Database error: ' + error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export default handler;
