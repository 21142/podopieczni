import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Icons } from '~/components/icons/Icons';
import { Button } from '~/components/primitives/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/primitives/DropdownMenu';

export function LanguageToggle() {
  const { t } = useTranslation('common');
  const router = useRouter();

  const switchToLocale = useCallback(
    (locale: string) => {
      const path = router.asPath;

      return router.push(path, path, { locale });
    },
    [router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="z-10"
        asChild
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0"
        >
          <Icons.globe className="h-5 w-5" />
          <span className="sr-only">{t('language_toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchToLocale('en')}>
          <Icons.english className="mr-2 h-4 w-8" />
          <span>{t('language_english')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchToLocale('pl')}>
          <Icons.polish className="mr-2 h-4 w-8" />
          <span>{t('language_polish')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
