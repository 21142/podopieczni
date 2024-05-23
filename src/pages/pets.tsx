/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Dialog, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FilterIcon, XIcon } from '@heroicons/react/outline';
import ChevronDoubleUpIcon from '@heroicons/react/solid/ChevronDoubleUpIcon';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import AdoptionFormCard from '~/components/cards/AdoptionFormCard';
import FilterPetsResultsForm from '~/components/forms/FilterPetsResultsForm';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchCategory from '~/components/utility/SearchCategory';
import SearchPetsResults from '~/components/utility/SearchPetsResults';
import { links } from '~/config/siteConfig';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { type PetAvailableForAdoption } from '~/types';

export interface IResults {
  searchQuery: string;
}

const sortOptions = [
  {
    en: 'Newest addition',
    pl: 'Nowi podopieczni',
    href: links.scrollToPosition,
    current: true,
  },
  {
    en: 'Oldest addition',
    pl: 'Starsi podopieczni',
    href: links.scrollToPosition,
    current: false,
  },
  {
    en: 'Most Popular',
    pl: 'Najbardziej popularni',
    href: links.scrollToPosition,
    current: false,
  },
];

const Results: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ searchQuery }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { t, i18n } = useTranslation('common');

  const { data: animals, isLoading } =
    api.pet.queryPetsAvailableForAdoptionFulltextSearch.useQuery({
      searchQuery,
    });

  return (
    <PageLayout>
      <div
        id="scrollToPosition"
        className="flex w-full items-center justify-center bg-primary-300 pt-4 text-center"
      >
        <Search
          query={searchQuery ?? ''}
          typeOfResults={TypeOfResults.Animal}
        />
      </div>
      <BackgroundWave />

      {/* Mobile filter dialog */}
      <Transition.Root
        show={mobileFiltersOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-background py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-foreground">
                  {t('filters')}
                </h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-background p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="p-4">
                <FilterPetsResultsForm />
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <main className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex items-baseline justify-between pb-6">
          <h1 className="max-w-[300px] text-2xl font-semibold tracking-tight sm:max-w-none sm:text-4xl">
            {t('results_title')}
          </h1>

          <div className="flex items-center">
            <Menu
              as="div"
              className="relative inline-block text-left"
            >
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  {t('sort')}
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-background shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option[i18n.language as 'en' | 'pl']}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={cn(
                              option.current
                                ? 'font-medium text-foreground'
                                : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {option[i18n.language as 'en' | 'pl']}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">{t('filters')}</span>
              <FilterIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <section
          aria-labelledby="pets-heading"
          className="pb-24"
        >
          <h2
            id="products-heading"
            className="sr-only"
          >
            Pets
          </h2>

          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-[250px_minmax(700px,_1fr)]">
            <AdoptionFormCard />
            <div className="hidden lg:row-start-2 lg:row-end-3 lg:block">
              <FilterPetsResultsForm />
            </div>
            <SearchCategory />
            <SearchPetsResults
              isLoading={isLoading}
              results={animals}
            />
          </div>
        </section>
        <Link
          href={links.scrollToPosition}
          scroll={false}
          className="z-50 mx-auto -mt-6 flex w-fit justify-center"
        >
          <span className="sr-only">Scroll to top</span>
          <ChevronDoubleUpIcon className="duration-50 h-12 cursor-pointer text-primary-300 transition-transform ease-in-out hover:scale-95" />
        </Link>
      </main>
    </PageLayout>
  );
};

export default Results;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const search = query.search ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol as string}://${host as string}`
    : '';
  const locale = context.locale ?? 'en';

  const availablePets: PetAvailableForAdoption[] = await fetch(
    `${baseUrl}/api/animals?search=${search}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching animals: ${res}`);
      }
      return res.json();
    })
    .then((data): PetAvailableForAdoption[] => {
      return data;
    });

  if (!availablePets || availablePets.length == 0)
    return {
      props: {
        animals: [],
        searchQuery: search,
        ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
      },
    };

  return {
    props: {
      animals: availablePets,
      searchQuery: search,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
};
