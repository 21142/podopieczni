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
import AdoptionFormCard from '~/components/cards/AdoptionFormCard';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchCategory from '~/components/utility/SearchCategory';
import SearchResults from '~/components/utility/SearchResults';
import { TypeOfResults } from '~/lib/constants';
import type IAnimalData from '~/types/petfinderTypes';

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
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'black', label: 'Black', checked: false },
    ],
  },
  {
    id: 'age',
    name: 'Age',
    options: [
      { value: 'puppy', label: 'Puppy', checked: false },
      { value: 'young', label: 'Young', checked: false },
      { value: 'adult', label: 'Adult', checked: false },
      { value: 'senior', label: 'Senior', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: 'small', label: 'Small', checked: false },
      { value: 'medium', label: 'Medium', checked: false },
      { value: 'large', label: 'Large', checked: false },
      { value: 'extra large', label: 'Extra Large', checked: false },
    ],
  },
];

const sortOptions = [
  { name: 'Most Popular', href: '#scrollToPosition', current: true },
  { name: 'Newest addition', href: '#scrollToPosition', current: false },
  { name: 'Oldest addition', href: '#scrollToPosition', current: false },
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
          <h1 className="max-w-[300px] text-2xl font-medium tracking-tight sm:max-w-none sm:text-4xl">
            {searchQuery
              ? `Results for ${searchQuery}`
              : 'Dostępni podopieczni'}
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
          aria-labelledby="pets-heading"
          className="pt-6 pb-24"
        >
          <h2
            id="products-heading"
            className="sr-only"
          >
            Pets
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-[250px_minmax(700px,_1fr)]">
            <AdoptionFormCard />
            {/* Filters */}
            <div className="hidden lg:row-start-2 lg:row-end-3 lg:block">
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
            </div>
            <SearchCategory />
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
