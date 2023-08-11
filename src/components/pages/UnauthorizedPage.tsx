import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '../primitives/Button';

const UnauthorizedPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className="grid h-[50vh] content-center">
      <p className="p-12 text-center">{t('unauthorized_title')}</p>
      <div className="flex justify-center gap-5">
        <Button
          variant="primary"
          size="lg"
          onClick={() => void router.push('/')}
        >
          {t('button_navigate_home')}
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
