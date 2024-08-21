/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AdoptionFormCard from '~/components/cards/AdoptionFormCard';
import FilterPetsResultsForm from '~/components/forms/FilterPetsResultsForm';
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
import Spinner from '~/components/spinner/Spinner';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchCategory from '~/components/utility/SearchCategory';
import SearchPetsResults from '~/components/utility/SearchPetsResults';
import { links } from '~/config/siteConfig';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';
import { cn } from '~/lib/utils';
import { type IPetFilterOptions } from '~/lib/validators/petValidation';
import { type PetAvailableForAdoption } from '~/types';

export interface IResults {
  searchQuery: string;
}

const SORT_OPTIONS = [
  {
    en: 'None',
    pl: 'Brak',
    value: 'none',
    current: true,
  },
  {
    en: 'Newest addition',
    pl: 'Ostatnio dodani',
    value: 'newest',
    current: false,
  },
  {
    en: 'Oldest addition',
    pl: 'Dawniej dodani',
    value: 'oldest',
    current: false,
  },
] as const;

const Results: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ searchQuery }) => {
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filter, setFilter] = useState<IPetFilterOptions>({
    sortBy: 'none',
  });

  const { t, i18n } = useTranslation('common');

  const {
    data: petsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.pet.queryPetsAvailableForAdoption.useInfiniteQuery(
    {
      searchQuery,
      filter,
      limit: 12,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 500 >=
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

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

      <main className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="z-10 flex items-baseline justify-between pb-6">
          <h1 className="max-w-[300px] text-2xl font-semibold tracking-tight sm:max-w-none sm:text-4xl">
            {t('results_title')}
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
                          : 'text-muted-foreground',
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
                    <FilterPetsResultsForm />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
              results={petsData?.pages.flatMap((page) => page.pets) ?? []}
            />
          </div>
        </section>
        {isFetchingNextPage && (
          <div className="z-50 mx-auto -mt-6 flex w-fit justify-center">
            <Spinner />
          </div>
        )}
        {!hasNextPage && (
          <span
            onClick={() => router.push(links.scrollToPosition)}
            className="z-50 mx-auto -mt-6 flex w-fit justify-center"
          >
            <span className="sr-only">Scroll to top</span>
            <Icons.doubleChevronUp className="duration-50 h-12 w-12 cursor-pointer text-primary-300 transition-transform ease-in-out hover:scale-95" />
          </span>
        )}
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
        throw new Error(`Error fetching animals: ${res.toString()}`);
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
