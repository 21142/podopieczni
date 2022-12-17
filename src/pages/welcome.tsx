import type { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CvaButton } from 'src/components/buttons/cva/ButtonCva';
import { LinkButton } from 'src/components/buttons/link/LinkButton';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import Spinner from 'src/components/spinner/Spinner';
import { trpc } from 'src/utils/trpc';

const Welcome: NextPage = () => {
  const router = useRouter();

  const query = trpc.auth.getSession.useQuery();
  const sessionData = query.data;

  const isLoggingInQuery = trpc.auth.getSession.useQuery();
  const meQuery = trpc.user.me.useQuery();

  const isLoggingIn = isLoggingInQuery.data;
  const hasRole = meQuery.data?.role ? true : false;

  const { mutateAsync: setRoleAsAdopter } =
    trpc.auth.setAdoptingRole.useMutation();
  const { mutateAsync: setRoleAsShelter } =
    trpc.auth.setShelterWorkerRole.useMutation();

  const setAdopterRole = async () => {
    await setRoleAsAdopter();
    console.log('HERE? ADOPTER SET');
    router.push('/results');
  };

  const setShelterRole = async () => {
    await setRoleAsShelter();
    console.log('HERE? SHELTER SET');
    router.push('/dashboard');
  };

  if (sessionData?.role) {
    router.push('/dashboard');
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
        <div className="grid h-[50vh] content-center">
          <p className="p-12 text-center">
            Zaloguj się, aby wybrać w czym możemy Ci pomóc?
          </p>
          <div className="flex justify-center gap-5">
            <CvaButton
              variant="primary"
              className="w-36 rounded-md px-4 py-2"
              onClick={sessionData ? () => signOut() : () => signIn()}
            >
              {sessionData ? 'Wyloguj się' : 'Zaloguj się'}
            </CvaButton>
            <CvaButton
              variant="secondary"
              className="w-36 rounded-md"
              onClick={() => router.push('/')}
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
