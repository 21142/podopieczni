import type { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CvaButton } from 'src/components/buttons/cva/ButtonCva';
import { LinkButton } from 'src/components/buttons/link/LinkButton';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import Spinner from 'src/components/spinner/Spinner';
import { api } from '~/utils/api';

const Welcome: NextPage = () => {
  const router = useRouter();

  const query = api.auth.getSession.useQuery();
  const sessionData = query.data;

  const isLoggingInQuery = api.auth.getSession.useQuery();
  const meQuery = api.user.me.useQuery();

  const isLoggingIn = isLoggingInQuery.data;
  const hasRole = meQuery.data?.role ? true : false;

  const { mutateAsync: setRoleAsAdopter } =
    api.auth.setAdoptingRole.useMutation();
  const { mutateAsync: setRoleAsShelter } =
    api.auth.setShelterWorkerRole.useMutation();

  const setAdopterRole: () => Promise<void> = async () => {
    await setRoleAsAdopter();
    console.log('HERE? ADOPTER SET');
    await router.push('/results');
  };

  const setShelterRole: () => Promise<void> = async () => {
    await setRoleAsShelter();
    console.log('HERE? SHELTER SET');
    await router.push('/dashboard');
  };

  if (sessionData?.role) {
    void router.push('/dashboard');
  }

  return (
    <PageLayout>
      {isLoggingIn ? (
        hasRole ? (
          <div className="grid h-[50vh] content-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid h-80 place-items-center content-center">
            <p className="text-lg">Please, tell us what are you here for</p>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <LinkButton
                value="I want to adopt a pet"
                onClick={() => setAdopterRole}
              />
              <LinkButton
                value="I work in a shelter"
                onClick={() => setShelterRole}
              />
            </div>
          </div>
        )
      ) : (
        <div className="grid h-[50vh] content-center">
          <p className="p-12 text-center">
            Zaloguj się, aby wybrać w czym możemy Ci pomóc?
          </p>
          <div className="flex justify-center gap-5">
            <CvaButton
              variant="primary"
              className="w-36 rounded-md px-4 py-2"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? 'Wyloguj się' : 'Zaloguj się'}
            </CvaButton>
            <CvaButton
              variant="secondary"
              className="w-36 rounded-md"
              onClick={() => void router.push('/')}
            >
              Strona główna
            </CvaButton>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Welcome;
