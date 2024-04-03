import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import AuthButton from 'src/components/buttons/auth/AuthButton';
import { Icons } from '~/components/icons/Icons';
import Logo from '~/components/logos/Logo';
import LogoDark from '~/components/logos/LogoDark';
import { buttonVariants } from '~/components/primitives/Button';
import { ThemeToggle } from '~/components/utility/ThemeToggle';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { Roles } from '~/lib/constants';
import { cn } from '~/lib/utils';
import HeaderLink from '../links/HeaderLink';
import { LanguageToggle } from '../utility/LanguageToggle';

const DashboardHeader: React.FC<JSX.IntrinsicElements['header']> = ({
  className,
  ...headerProps
}) => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const { data: userFromSession } = useUserFromSessionQuery();

  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { t } = useTranslation('common');

  return (
    <header
      {...headerProps}
      className={`top-0 z-10 h-20 w-full border-b border-b-accent py-[14px] px-8 ${
        className ?? ''
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-x-3 md:gap-x-10 lg:max-w-8xl lg:gap-x-10">
        <Link href="/">
          <div className="relative z-30 flex">
            {currentTheme === 'light' ? <Logo /> : <LogoDark />}
          </div>
        </Link>
        <nav
          className={classNames(
            mobileMenuIsOpen
              ? 'fixed top-0 left-0 m-0 flex h-full w-full flex-col bg-background pt-16 [&_a]:flex [&_a]:h-16 [&_a]:items-center [&_a]:pl-10'
              : 'hidden items-center gap-x-10 md:inline-flex'
          )}
        >
          <HeaderLink
            href="/"
            title={t('nav_home')}
          />
          {userFromSession &&
          (userFromSession.role === Roles.Shelter ||
            userFromSession.role === Roles.Admin) ? (
            <>
              <HeaderLink
                href="/dashboard"
                title={t('nav_shelter')}
              />
              <HeaderLink
                href="/animals"
                title={t('nav_animals')}
              />
              <HeaderLink
                href="/users"
                title={t('nav_people')}
              />
            </>
          ) : (
            <>
              <HeaderLink
                href="/"
                title={t('nav_adopt')}
              />
              <HeaderLink
                href="/"
                title={t('nav_about')}
              />
            </>
          )}
          {mobileMenuIsOpen && (
            <HeaderLink
              href="/user/favorites"
              title={t('nav_favorites')}
              className={cn(
                buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                }),
                'text-md justify-start rounded-none font-normal'
              )}
            />
          )}
          {mobileMenuIsOpen && (
            <div className="flex items-center gap-x-5 pl-10 pt-3 md:hidden">
              <AuthButton />
              <LanguageToggle />
              <ThemeToggle />
            </div>
          )}
        </nav>
        <div className="flex items-center justify-between gap-x-2 sm:gap-x-5">
          <div className="mr-12 hidden items-center gap-x-5 sm:mr-0 md:inline-flex">
            <Link
              href="/user/favorites"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'h-9 w-9 px-0',
              })}
            >
              <Icons.heart className="h-8 w-8" />
            </Link>
            <ThemeToggle />
            <LanguageToggle />
            <AuthButton />
          </div>
          <div className={mobileMenuIsOpen ? '' : 'md:hidden'}>
            <button
              className={classNames(
                mobileMenuIsOpen ? 'fixed top-6 right-5' : '',
                'z-10'
              )}
              onClick={() =>
                setMobileMenuIsOpen((currentState) => !currentState)
              }
            >
              <span className="sr-only">Toggle navigation menu</span>
              {mobileMenuIsOpen ? (
                <XIcon className="h-8 w-8 cursor-pointer" />
              ) : (
                <MenuAlt2Icon className="h-8 w-8 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
