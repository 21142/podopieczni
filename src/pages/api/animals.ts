/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/env.mjs';
import type IAnimalData from '~/lib/petfinderTypes';
import { type IResults, type PetfinderOauth } from '../results';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const petfindetOauthData = (await fetch(
      `${env.NEXT_PUBLIC_BASE_URL}/api/petfinder-oauth-token`
    ).then((res) => res.json())) as PetfinderOauth;
    if (petfindetOauthData.access_token) {
      const petfindetData = (await fetch(
        'https://api.petfinder.com/v2/animals',
        {
          headers: {
            Authorization: `Bearer ${petfindetOauthData.access_token}`,
          },
        }
      ).then((res) => res.json())) as IResults;
      if (!petfindetData.animals) return;
      const allAnimals: IAnimalData[] = petfindetData.animals;
      res.status(200).json(allAnimals);
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not load data' });
  }
};

export default handler;
