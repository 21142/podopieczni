import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import BackgroundWavesFooter from '~/components/utility/BackgroundWavesFooter';
import { links } from '~/config/siteConfig';
import { Roles, TypeOfResults } from '~/lib/constants';

const Footer = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  return (
    <>
      <BackgroundWavesFooter className="-z-10 -mt-40 aspect-[10/1] sm:mt-0" />
      <footer className="relative w-full bg-primary-300">
        <div
          id="footer"
          className="absolute -top-32"
        />
        <div className="flex flex-col items-center justify-center">
          <div className="mt-2 grid max-w-[77.5rem] grid-cols-2 gap-6 px-6 py-8 text-neutral-50 md:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">
                {t('footer_sitemap')}
              </h2>
              <ul className="">
                <li className="mb-4">
                  <a
                    href={links.home}
                    className=" hover:underline"
                  >
                    {t('nav_home')}
                  </a>
                </li>
                {session?.user.role !== Roles.Adopter && (
                  <li className="mb-4">
                    <a
                      href={links.dashboard}
                      className="hover:underline"
                    >
                      {t('nav_shelter')}
                    </a>
                  </li>
                )}
                <li className="mb-4">
                  <a
                    href={links.adoption}
                    className="hover:underline"
                  >
                    {t('nav_adopt')}
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href={links.about}
                    className="hover:underline"
                  >
                    {t('nav_about')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">
                {t('nav_adopt')}
              </h2>
              <ul className="">
                <li className="mb-4">
                  <a
                    href={links.searchDogs}
                    className="hover:underline"
                  >
                    {t('footer_find_dogs')}
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href={links.searchCats}
                    className="hover:underline"
                  >
                    {t('footer_find_cats')}
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href={links.results(TypeOfResults.Organization)}
                    className="hover:underline"
                  >
                    {t('footer_find_shelters')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">
                {t('footer_contact')}
              </h2>
              <ul className="">
                <li className="mb-4">
                  <a
                    href={links.facebook}
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href={links.contact}
                    className="hover:underline"
                  >
                    {t('footer_how_to_contact')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">
                {t('footer_legal')}
              </h2>
              <ul className="">
                <li className="mb-4">
                  <a
                    href={links.termsOfService}
                    className="hover:underline"
                  >
                    {t('footer_terms_of_service')}
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href={links.privacyPolicy}
                    className="hover:underline"
                  >
                    {t('footer_privacy_policy')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-neutral-0 sm:text-center">
              © {new Date().getFullYear()} podopieczni™
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
