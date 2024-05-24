import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { buttonVariants } from '~/components/primitives/Button';
import { links } from '~/config/siteConfig';
import { toast } from '~/hooks/useToast';
import { cn } from '~/lib/utils';

export const useLoginToast = () => {
  const { t } = useTranslation('common');
  const loginToast = () => {
    const { dismiss } = toast({
      title: t('login_toast_title'),
      description: t('login_toast_description'),
      variant: 'destructive',
      action: (
        <Link
          href={links.signIn}
          onClick={() => dismiss()}
          className={cn(
            buttonVariants({ variant: 'default', size: 'sm' }),
            'w-32'
          )}
        >
          {t('nav_login')}
        </Link>
      ),
    });
  };

  return { loginToast };
};
