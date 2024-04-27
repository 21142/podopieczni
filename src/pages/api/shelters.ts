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
              name: { search: searchQuery },
            },
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
