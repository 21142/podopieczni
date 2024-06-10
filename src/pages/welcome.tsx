import type { GetServerSidePropsContext, NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/navigation';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';
import Spinner from '~/components/spinner/Spinner';
import { links } from '~/config/siteConfig';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { api } from '~/lib/api';
import { getServerAuthSession } from '~/lib/auth';
import { Roles, TypeOfResults } from '~/lib/constants';

const Welcome: NextPage = () => {
  const router = useRouter();

  const { data: userFromSession, isLoading, error } = useUserFromSessionQuery();

  const hasRole = userFromSession?.role ? true : false;

  const setRoleAsAdopter = api.auth.setAdoptingRole.useMutation();
  const setRoleAsShelter = api.auth.setShelterWorkerRole.useMutation();

  const setAdopterRole = async () => {
    await setRoleAsAdopter.mutateAsync();
    router.replace(links.results(TypeOfResults.Animal));
  };

  const setShelterRole = async () => {
    await setRoleAsShelter.mutateAsync();
    router.replace(links.dashboard);
  };

  if (userFromSession?.role) {
    const redirectSlug: string =
      userFromSession?.role == Roles.Adopter
        ? links.home
        : links.associateShelter;
    router.replace(redirectSlug);
  }

  // TODO: Clean up this mess - no low level html in pages (extract into components)
  if (isLoading)
    return (
      <PageLayout>
        <div className="grid h-[70vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );

  if (error)
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <p className="p-12 text-center">
            Zaloguj się, aby wybrać w czym możemy Ci pomóc?
          </p>
          <div className="flex justify-center gap-5">
            <Button
              variant="primary"
              size="lg"
              onClick={userFromSession ? () => signOut() : () => signIn()}
            >
              {userFromSession ? 'Wyloguj się' : 'Zaloguj się'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push(links.home)}
            >
              Strona główna
            </Button>
          </div>
        </div>
      </PageLayout>
    );

  return (
    <PageLayout>
      {userFromSession && !hasRole && (
        <div className="grid h-80 place-items-center content-center">
          <p className="text-lg">Powiedz nam w jakim celu tworzysz konto</p>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Button
              variant="roundedButton"
              onClick={setAdopterRole}
            >
              Szukam podopiecznego
            </Button>
            <Button
              variant="roundedButton"
              onClick={setShelterRole}
            >
              Pracuję w schronisku
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Welcome;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const locale = ctx.locale ?? 'en';
  if (!session) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
}
