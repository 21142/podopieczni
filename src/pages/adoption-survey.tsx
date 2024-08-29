import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSearchParams } from 'next/navigation';
import AdoptionSurveyForm from '~/components/forms/AdoptionSurveyForm';
import PageLayout from '~/components/layouts/PageLayout';

const AdoptionSurvey = () => {
  const params = useSearchParams();
  const petId = params.get('petId');

  if (!petId) {
    return (
      <PageLayout>
        <div className="flex h-[40vh] w-screen items-center justify-center">
          <p>petId parameter is missing</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <AdoptionSurveyForm petId={petId} />
    </PageLayout>
  );
};

export default AdoptionSurvey;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
