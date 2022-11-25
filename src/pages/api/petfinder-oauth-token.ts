import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '../../env/server.mjs';

const petfinderApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', env.PETFINDER_KEY);
  params.append('client_secret', env.PETFINDER_SECRET);

  try {
    const petfinderRes = await fetch(
      'https://api.petfinder.com/v2/oauth2/token',
      {
        method: 'POST',
        body: params,
      }
    );
    const token = await petfinderRes.json();
    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: `Could not get a token, msg: ${err}` });
  }
};

export default petfinderApi;
