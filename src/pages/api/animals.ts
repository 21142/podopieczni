/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import type IAnimalData from "src/components/utils/search-results/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const petfindetOauthData = await fetch(
      `${baseUrl as string}/api/petfinder-oauth-token`
    ).then((res) => res.json());
    const accessToken = petfindetOauthData.access_token;
    if (accessToken) {
      const petfindetData = await fetch(
        "https://api.petfinder.com/v2/animals",
        {
          headers: {
            Authorization: `Bearer ${accessToken as string}`,
          },
        }
      ).then((res) => res.json());
      const allAnimals: IAnimalData[] = petfindetData.animals;
      res.status(200).json(allAnimals);
    }
  } catch (err) {
    res.status(500).json({ error: "Could not load data" });
  }
};

export default handler;
