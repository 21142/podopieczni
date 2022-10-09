import { NextApiRequest, NextApiResponse } from 'next';
import IAnimalData from 'src/components/utils/search-results/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { host } = req.headers;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = req ? `${protocol}://${host}` : '';

  try {
    const petfindetOauthData = await fetch(
      `${baseUrl}/api/petfinder-oauth-token`
    ).then((res) => res.json());
    const accessToken = petfindetOauthData.access_token;
    if (accessToken) {
      const petfindetData = await fetch(
        'https://api.petfinder.com/v2/animals?location=22152',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      ).then((res) => res.json());
      const allAnimals: IAnimalData[] = petfindetData.animals;
      res.status(200).json(allAnimals);
    }
  } catch (err) {
    res.status(500).json({ error: `Could not load data, msg: ${err}` });
  }
};

export default handler;
