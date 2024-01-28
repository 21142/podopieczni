import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import { Card, CardContent, CardTitle } from '~/components/primitives/Card';
import Spinner from '~/components/spinners/Spinner';
import { api } from '~/lib/api';

const Expensive: NextPage = () => {
  const { data, error, isLoading } = api.test.expensive.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.data?.code === 'TOO_MANY_REQUESTS') {
        return false;
      }
      return failureCount < 2;
    },
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="prose mx-auto flex max-w-6xl flex-col items-center justify-center rounded-md p-6 text-foreground">
        <h1 className="mb-4 font-bold text-foreground">
          Rate Limiter E2E Test Page
        </h1>
        <h2 className="text-muted-foreground">
          (runs an &apos;expensive&apos; query on page load)
        </h2>
        <div className="my-4">
          <p>
            Refresh the page multiple times in a short amount of time to test
            rate limiter
          </p>
        </div>
        <div className="my-6 w-full lg:text-lg">
          <Card className="min-h-[10rem]">
            <CardContent>
              <CardTitle className="text-foreground">Query result: </CardTitle>
              {data ? (
                <p className="mb-0 text-muted-foreground">{data}</p>
              ) : (
                <p className="mb-0 text-error-300">{error?.message}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Expensive;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
