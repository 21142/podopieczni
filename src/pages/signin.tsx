import { type GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSearchParams } from 'next/navigation';
import PageLayout from '~/components/layouts/PageLayout';
import AuthenticationPage from '~/components/pages/AuthenticationPage';
import { getServerAuthSession } from '~/lib/auth';

const SignIn = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <PageLayout>{!session && <AuthenticationPage error={error} />}</PageLayout>
  );
};

export default SignIn;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const locale = ctx.locale ?? 'en';
  if (session) {
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
