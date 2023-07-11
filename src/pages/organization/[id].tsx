import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { type GetServerSideProps, type NextPage } from 'next/types';
import PageLayout from '~/components/layouts/PageLayout';
import { type IOrganizationData } from '~/lib/petfinderTypes';
import { type PetfinderOauth } from '../results';

type IOrganizationProfilePage = {
  organization: IOrganizationData;
  message: string;
};

type PetfinderData = {
  organization: IOrganizationData;
};

const PetProfilePage: NextPage<IOrganizationProfilePage> = ({
  organization,
  message,
}) => {
  const id = useSearchParams().get('id');

  return (
    <PageLayout>
      <div className="grid h-full items-center justify-center">
        {organization === null ? (
          <p>{message}</p>
        ) : (
          <>
            <Image
              src={organization.photos[0]?.large ?? '/no-profile-picture.svg'}
              alt="profile picture"
              className="rounded-md"
              width="600"
              height="400"
            />
            <p>
              <strong>id:</strong> {id}
            </p>
            <p>
              <strong>name:</strong> {organization.name}
            </p>
            <p>
              <strong>phone:</strong> {organization.phone}
            </p>
            <p>
              <strong>address:</strong> {organization.address.city}{' '}
              {organization.address.state} {organization.address.country}
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
    let url = 'https://api.petfinder.com/v2/organizations?location=22152';
    if (id) {
      url = `https://api.petfinder.com/v2/organizations/${id}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as PetfinderData;
    const organization = petfindetData?.organization;

    if (organization) {
      return {
        props: {
          organization: organization,
          message: 'success',
        },
      };
    } else {
      return {
        props: {
          organization: null,
          message: `no organization found for id: ${id}`,
        },
      };
    }
  } else {
    return {
      props: {
        organization: null,
        message: 'no access token',
      },
    };
  }
};
