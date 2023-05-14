import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  FilterIcon,
  MinusSmIcon,
  PlusSmIcon,
  XIcon,
} from '@heroicons/react/outline';
import ChevronDoubleUpIcon from '@heroicons/react/solid/ChevronDoubleUpIcon';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import Search from 'src/components/inputs/search/Search';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import SearchResults from 'src/components/utils/search-results/SearchResults';
import type IAnimalData from 'src/components/utils/search-results/types';
import { TypeOfResults } from '~/utils/constants';

export interface IResults {
  animals?: IAnimalData[];
  searchQuery: string;
}

export interface PetfinderOauth {
  access_token: string;
}

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: false },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: false },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: false },
    ],
  },
];

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Results: NextPage<IResults> = ({ animals, searchQuery }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <PageLayout>
      <div
        id="scrollToPosition"
        className="flex w-full items-center justify-center bg-primary-300 pt-4 text-center"
      >
        <Search
          query={searchQuery}
          typeOfResults={TypeOfResults.Animal}
        />
      </div>
      <div
        id="featured"
        className="aspect-[40/1] rotate-180"
      >
        <svg
          id="visual"
          viewBox="0 0 3840 96"
          width="3840"
          height="96"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <path
            d="M0 26L40 26.7C80 27.3 160 28.7 240 33.8C320 39 400 48 480 50.7C560 53.3 640 49.7 720 45.3C800 41 880 36 960 33.8C1040 31.7 1120 32.3 1200 31C1280 29.7 1360 26.3 1440 28C1520 29.7 1600 36.3 1680 37.2C1760 38 1840 33 1920 33.2C2000 33.3 2080 38.7 2160 40.5C2240 42.3 2320 40.7 2400 40.2C2480 39.7 2560 40.3 2640 37.3C2720 34.3 2800 27.7 2880 27.5C2960 27.3 3040 33.7 3120 34.3C3200 35 3280 30 3360 32.7C3440 35.3 3520 45.7 3600 47.8C3680 50 3760 44 3800 41L3840 38L3840 97L3800 97C3760 97 3680 97 3600 97C3520 97 3440 97 3360 97C3280 97 3200 97 3120 97C3040 97 2960 97 2880 97C2800 97 2720 97 2640 97C2560 97 2480 97 2400 97C2320 97 2240 97 2160 97C2080 97 2000 97 1920 97C1840 97 1760 97 1680 97C1600 97 1520 97 1440 97C1360 97 1280 97 1200 97C1120 97 1040 97 960 97C880 97 800 97 720 97C640 97 560 97 480 97C400 97 320 97 240 97C160 97 80 97 40 97L0 97Z"
            fill="#eebdf2"
          ></path>
          <path
            d="M0 63L40 61C80 59 160 55 240 56.2C320 57.3 400 63.7 480 66.8C560 70 640 70 720 68.3C800 66.7 880 63.3 960 59.3C1040 55.3 1120 50.7 1200 47.5C1280 44.3 1360 42.7 1440 44.2C1520 45.7 1600 50.3 1680 52.8C1760 55.3 1840 55.7 1920 57.3C2000 59 2080 62 2160 61.5C2240 61 2320 57 2400 53.3C2480 49.7 2560 46.3 2640 44.5C2720 42.7 2800 42.3 2880 42.2C2960 42 3040 42 3120 43.5C3200 45 3280 48 3360 52.2C3440 56.3 3520 61.7 3600 61.7C3680 61.7 3760 56.3 3800 53.7L3840 51L3840 97L3800 97C3760 97 3680 97 3600 97C3520 97 3440 97 3360 97C3280 97 3200 97 3120 97C3040 97 2960 97 2880 97C2800 97 2720 97 2640 97C2560 97 2480 97 2400 97C2320 97 2240 97 2160 97C2080 97 2000 97 1920 97C1840 97 1760 97 1680 97C1600 97 1520 97 1440 97C1360 97 1280 97 1200 97C1120 97 1040 97 960 97C880 97 800 97 720 97C640 97 560 97 480 97C400 97 320 97 240 97C160 97 80 97 40 97L0 97Z"
            fill="#cc73d4"
          ></path>
          <path
            d="M0 79L40 79.7C80 80.3 160 81.7 240 79C320 76.3 400 69.7 480 69.5C560 69.3 640 75.7 720 76.2C800 76.7 880 71.3 960 71.2C1040 71 1120 76 1200 79.3C1280 82.7 1360 84.3 1440 83.5C1520 82.7 1600 79.3 1680 78.2C1760 77 1840 78 1920 76.5C2000 75 2080 71 2160 68.5C2240 66 2320 65 2400 66.8C2480 68.7 2560 73.3 2640 73.5C2720 73.7 2800 69.3 2880 68.5C2960 67.7 3040 70.3 3120 71.8C3200 73.3 3280 73.7 3360 72.7C3440 71.7 3520 69.3 3600 70.5C3680 71.7 3760 76.3 3800 78.7L3840 81L3840 97L3800 97C3760 97 3680 97 3600 97C3520 97 3440 97 3360 97C3280 97 3200 97 3120 97C3040 97 2960 97 2880 97C2800 97 2720 97 2640 97C2560 97 2480 97 2400 97C2320 97 2240 97 2160 97C2080 97 2000 97 1920 97C1840 97 1760 97 1680 97C1600 97 1520 97 1440 97C1360 97 1280 97 1200 97C1120 97 1040 97 960 97C880 97 800 97 720 97C640 97 560 97 480 97C400 97 320 97 240 97C160 97 80 97 40 97L0 97Z"
            fill="#a704b5"
          ></path>
        </svg>
      </div>

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
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusSmIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusSmIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="gap-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-semibold tracking-tight">
            {searchQuery ? `Results for ${searchQuery}` : 'Our pets'}
          </h1>

          <div className="flex items-center">
            <Menu
              as="div"
              className="relative inline-block text-left"
            >
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
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
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current
                                ? 'font-medium text-gray-900'
                                : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {option.name}
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
              <span className="sr-only">Filters</span>
              <FilterIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <section
          aria-labelledby="products-heading"
          className="pt-6 pb-24"
        >
          <h2
            id="products-heading"
            className="sr-only"
          >
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              <h3 className="sr-only">Filters</h3>

              {filters.map((section) => (
                <Disclosure
                  as="div"
                  key={section.id}
                  className="border-b border-gray-200 py-6"
                >
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-neutral-50/30 py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="gap-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                defaultValue={option.value}
                                type="checkbox"
                                defaultChecked={option.checked}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>

            <SearchResults
              results={animals}
              typeOfResults="pet"
            />
          </div>
        </section>
        <Link
          href="#scrollToPosition"
          scroll={false}
          className="-mt-6 flex justify-center"
        >
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
  const petfindetOauthData = (await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json())) as PetfinderOauth;
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    let url = 'https://api.petfinder.com/v2/animals?location=22152';
    if (search) {
      url = `https://api.petfinder.com/v2/animals?location=${search}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as IResults;
    const animals = petfindetData?.animals;

    if (!animals)
      return {
        props: {
          animals: null,
          searchQuery: search,
        },
      };

    return {
      props: {
        animals: animals,
        searchQuery: search,
      },
    };
  } else {
    return {
      props: {
        animals: ['no animals found'],
        searchQuery: search,
      },
    };
  }
};
