import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState, type FC } from 'react';
import AuthDropdownMenu from '~/components/auth-dropdown/AuthDropdownMenu';
import Logo from '~/components/logos/Logo';
import LogoDark from '~/components/logos/LogoDark';
import { buttonVariants } from '~/components/primitives/Button';
import { ThemeToggle } from '~/components/utility/ThemeToggle';
import { links } from '~/config/siteConfig';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { Roles } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { Icons } from '../icons/Icons';
import HeaderLink from '../links/HeaderLink';
import { LanguageToggle } from '../utility/LanguageToggle';

const Header: FC<JSX.IntrinsicElements['header']> = ({
  className,
  ...headerProps
}) => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const { data: session } = useSession();
  const { data: userFromSession } = useUserFromSessionQuery(session);

  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { t } = useTranslation('common');

  return (
    <header
      {...headerProps}
      className={`top-0 z-30 h-20 w-full border-b border-b-accent px-4 py-[14px] sm:px-8 ${
        className ?? ''
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-x-3 md:gap-x-10 lg:max-w-8xl lg:gap-x-10">
        <Link href={links.home}>
          <div className="relative z-30 flex">
            {currentTheme === 'light' ? <Logo /> : <LogoDark />}
          </div>
        </Link>
        <nav
          className={classNames(
            mobileMenuIsOpen
              ? 'fixed left-0 top-0 m-0 flex h-full w-full flex-col bg-background pt-16 [&_a]:flex [&_a]:h-16 [&_a]:items-center [&_a]:pl-10'
              : 'hidden items-center gap-x-10 md:inline-flex'
          )}
        >
          <HeaderLink
            href={links.home}
            title={t('nav_home')}
          />
          {userFromSession &&
            (userFromSession.role === Roles.Shelter ||
              userFromSession.role === Roles.Admin) && (
              <HeaderLink
                href={links.dashboard}
                title={t('nav_shelter')}
              />
            )}
          <HeaderLink
            href={links.adoption}
            title={t('nav_adopt')}
          />
          <HeaderLink
            href={links.about}
            title={t('nav_about')}
          />
          {mobileMenuIsOpen && (
            <HeaderLink
              href={links.favorites}
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
              <ThemeToggle />
              <LanguageToggle />
              <AuthDropdownMenu />
            </div>
          )}
        </nav>
        <div className="flex items-center justify-between gap-x-2 sm:gap-x-5">
          <div className="mr-12 hidden items-center gap-x-5 sm:mr-0 md:inline-flex">
            {!mobileMenuIsOpen && (
              <>
                <Link
                  href={links.favorites}
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
                <AuthDropdownMenu />
              </>
            )}
          </div>
          <div className={mobileMenuIsOpen ? '' : 'md:hidden'}>
            <button
              className={classNames(
                mobileMenuIsOpen ? 'fixed right-8 top-6' : '',
                'z-10'
              )}
              onClick={() =>
                setMobileMenuIsOpen((currentState) => !currentState)
              }
            >
              <span className="sr-only">Toggle navigation menu</span>
              {mobileMenuIsOpen ? (
                <Icons.close className="h-8 w-8 translate-x-3 cursor-pointer" />
              ) : (
                <Icons.menu className="h-8 w-8 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
