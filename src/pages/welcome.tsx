import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { LinkButton } from 'src/components/buttons/link/LinkButton';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import Landing from 'src/components/pages/landing/Landing';
import { trpc } from 'src/utils/trpc';

const Welcome: NextPage = () => {
  const router = useRouter();

  const isLoggingInQuery = trpc.auth.getSession.useQuery(undefined);
  const meQuery = trpc.user.me.useQuery(undefined);

  const isLoggingIn = isLoggingInQuery.data;
  const hasRole = meQuery.data?.role ? true : false;

  const { mutateAsync: setRoleAsAdopter } =
    trpc.auth.setAdoptingRole.useMutation();
  const { mutateAsync: setRoleAsShelter } =
    trpc.auth.setShelterWorkerRole.useMutation();

  const setAdopterRole = async () => {
    await setRoleAsAdopter();
    console.log('HERE? ADOPTER SET');
    router.push('/register');
  };

  const setShelterRole = async () => {
    await setRoleAsShelter();
    console.log('HERE? SHELTER SET');
    router.push('/dashboard');
  };

  return (
    <>
      <PageLayout>
        {isLoggingIn ? (
          hasRole ? (
            <div>HERE IS TEST VIEW FOR USERS WITH ASSIGNED ROLE</div>
          ) : (
            <div className="grid h-80 place-items-center content-center">
              <p className="text-lg">Please, tell us what are you here for</p>
              <div className="flex gap-5 p-5">
                <LinkButton
                  value="I want to adopt a pet"
                  onClick={setAdopterRole}
                />
                <LinkButton
                  value="I work in a shelter"
                  onClick={setShelterRole}
                />
              </div>
            </div>
          )
        ) : (
          <Landing />
        )}
      </PageLayout>
    </>
  );
};

export default Welcome;
