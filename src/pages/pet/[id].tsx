import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { type GetServerSideProps, type NextPage } from 'next/types';
import PageLayout from '~/components/layouts/PageLayout';
import type IAnimalData from '~/lib/petfinderTypes';
import { type PetfinderOauth } from '../results';

type IPetProfilePage = {
  pet: IAnimalData;
  message: string;
};

type PetfinderData = {
  animal: IAnimalData;
};

const PetProfilePage: NextPage<IPetProfilePage> = ({ pet, message }) => {
  const id = useSearchParams().get('id');

  return (
    <PageLayout>
      <div className="grid h-full items-center justify-center">
        {pet === null ? (
          <p>{message}</p>
        ) : (
          <>
            <Image
              src={pet.photos[0]?.large ?? '/no-profile-picture.svg'}
              alt="profile picture"
              className="rounded-md"
              width="600"
              height="400"
              priority={true}
            />
            <p>
              <strong>id:</strong> {id}
            </p>
            <p>
              <strong>name:</strong> {pet.name}
            </p>
            <p>
              <strong>status:</strong> {pet.status}
            </p>
            <p>
              <strong>description:</strong> {pet.description}
            </p>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default PetProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const id = query.id ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol as string}://${host as string}`
    : '';
  const petfindetOauthData = (await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json())) as PetfinderOauth;
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    let url = 'https://api.petfinder.com/v2/animals?location=22152';
    if (id) {
      url = `https://api.petfinder.com/v2/animals/${id}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as PetfinderData;
    const pet = petfindetData?.animal;

    if (pet) {
      return {
        props: {
          pet: pet,
          message: 'success',
        },
      };
    } else {
      return {
        props: {
          pet: null,
          message: `no animal found for id: ${id}`,
        },
      };
    }
  } else {
    return {
      props: {
        pet: null,
        message: 'no access token',
      },
    };
  }
};
