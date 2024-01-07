import { Separator } from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'next-i18next';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../primitives/Card';

const AdoptionFormCard = () => {
  const { t } = useTranslation('common');

  return (
    <Card className="lg: hidden lg:block">
      <CardHeader className="pb-4">
        <CardTitle className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-lg leading-6 text-transparent md:text-xl">
          {t('adoption_form_card_title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{t('adoption_form_card_description')}</CardDescription>
        <Separator className="my-3" />
        <Button
          variant="primaryLink"
          className="pl-0"
        >
          {t('adoption_form_card_button')}
          <Icons.doubleChevronRight className="ml-1 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdoptionFormCard;
