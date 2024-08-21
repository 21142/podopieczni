/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import AdoptionFormCard from '~/components/cards/AdoptionFormCard';
import FilterSheltersResults from '~/components/forms/FilterSheltersResultsForm';
import { Icons } from '~/components/icons/Icons';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/primitives/DropdownMenu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/primitives/Sheet';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchCategory from '~/components/utility/SearchCategory';
import SearchSheltersResults from '~/components/utility/SearchSheltersResults';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { type IShelterFilterOptions } from '~/lib/validators/shelterValidation';
import { type Shelter } from '~/types';

const SORT_OPTIONS = [
  {
    en: 'None',
    pl: 'Brak',
    value: 'none',
    current: true,
  },
  {
    en: 'Newest addition',
    pl: 'Ostatnio dodane',
    value: 'newest',
    current: false,
  },
  {
    en: 'Oldest addition',
    pl: 'Dawniej dodane',
    value: 'oldest',
    current: false,
  },
] as const;

const Organizations: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ searchQuery }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filter, setFilter] = useState<IShelterFilterOptions>({
    sortBy: 'none',
  });

  const { t, i18n } = useTranslation('common');
  const { data: organizations, isLoading } =
    api.shelter.queryAvailableShelters.useQuery({
      searchQuery,
      filter,
    });

  return (
    <PageLayout>
      <div
        id="scrollToPosition"
        className="flex w-full items-center justify-center bg-primary-300 pt-4 text-center"
      >
        <Search
          query={searchQuery}
          typeOfResults={TypeOfResults.Organization}
        />
      </div>
      <BackgroundWave />

      <main className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full justify-between">
          <h1 className="max-w-[300px] pb-6 text-2xl font-semibold tracking-tight sm:max-w-none sm:text-4xl">
            {t('organizations_title')}
          </h1>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center text-sm font-medium text-foreground/80 transition-all hover:text-foreground">
                {t('sort')}
                <Icons.chevronDown
                  className="ml-1 h-5 w-5 text-foreground/80 transition-all hover:text-foreground"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="mt-2 w-40 origin-top-right rounded-md bg-background shadow-2xl ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option[i18n.language as 'en' | 'pl']}
                      className={cn(
                        option.value === filter.sortBy
                          ? 'font-medium text-foreground'
                          : 'text-gray-500',
                        'block w-full px-4 py-2 text-sm',
                        'hover:cursor-pointer hover:bg-gray-100'
                      )}
                    >
                      <button
                        key={option.value}
                        className="w-full text-left"
                        onClick={() => {
                          setFilter((...prev) => ({
                            ...prev,
                            sortBy: option.value,
                          }));
                        }}
                      >
                        {option[i18n.language as 'en' | 'pl']}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet
              open={mobileFiltersOpen}
              onOpenChange={setMobileFiltersOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="link"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                >
                  <span className="sr-only">Filters</span>
                  <Icons.filter
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-full p-0 lg:hidden"
              >
                <div className="relative flex h-full w-full flex-col overflow-y-auto bg-background py-4 pb-12 pl-4 shadow-xl">
                  <SheetHeader className="flex items-start px-4 pb-6">
                    <SheetTitle className="text-lg font-medium text-foreground sm:text-xl md:text-3xl">
                      {t('filters')}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="w-full p-4">
                    <FilterSheltersResults />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="relative z-10 flex items-baseline justify-between pb-6">
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-[250px_minmax(700px,_1fr)]">
            <AdoptionFormCard />
            <div className="hidden lg:row-start-2 lg:row-end-3 lg:block">
              <FilterSheltersResults />
            </div>

            <SearchCategory />
            <SearchSheltersResults
              results={organizations}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Organizations;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const search = query.search ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol as string}://${host as string}`
    : '';
  const locale = context.locale ?? 'en';

  const shelters: Shelter[] = await fetch(
    `${baseUrl}/api/shelters?search=${search}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching shelters: ${res.toString()}`);
      }
      return res.json();
    })
    .then((data): Shelter[] => {
      return data;
    });

  return {
    props: {
      organizations: shelters,
      searchQuery: search,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
};
