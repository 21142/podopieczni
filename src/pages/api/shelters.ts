import { type Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let searchQuery = req.query.search;
    if (Array.isArray(searchQuery)) {
      searchQuery = searchQuery.join(' ');
    }
    let shelters;
    if (searchQuery) {
      shelters = await prisma.shelter.findMany({
        where: {
          OR: [
            {
              name: { contains: searchQuery },
            },
            {
              address: {
                OR: [
                  { address: { contains: searchQuery } },
                  { city: { contains: searchQuery } },
                  { state: { contains: searchQuery } },
                  { country: { contains: searchQuery } },
                  { postCode: { contains: searchQuery } },
                ] as Prisma.AddressInfoWhereInput[],
              },
            },
          ],
        },
      });
    } else {
      shelters = await prisma.shelter.findMany({
        include: {
          address: true,
        },
      });
    }
    res.status(200).json(shelters);
  } catch (err) {
    console.error('Error fetching shelters data:', err);
    res.status(500).json({ error: 'Could not load data' });
  }
};

export default handler;
