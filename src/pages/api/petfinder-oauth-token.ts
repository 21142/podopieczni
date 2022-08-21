import { NextApiRequest, NextApiResponse } from 'next';

const petFinderKey = 'MXEboQOpgMFvchE0epT0YGt5yH6VN78rEeNpXOcWEWyi1iCUJc';
const petFinderSecret = 'njbtwRHCVAwyMjUITV73wVc2NMvPPcEe0rupV0pT';

const petfinderApi: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', petFinderKey);
  params.append('client_secret', petFinderSecret);
  const petfinderRes = await fetch(
    'https://api.petfinder.com/v2/oauth2/token',
    {
      method: 'POST',
      body: params,
    }
  );
  const data = await petfinderRes.json();
  res.send(data);
};

export default petfinderApi;
