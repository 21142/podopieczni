import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { type GetServerSideProps, type NextPage } from 'next/types';
import React from 'react';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/primitives/Card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/primitives/Carousel';
import { Separator } from '~/components/primitives/Separator';
import type IAnimalData from '~/types/petfinderTypes';
import { type PetfinderOauth } from '../results';

type IPetProfilePage = {
  pet: IAnimalData;
  message: string;
};

type PetfinderData = {
  animal: IAnimalData;
};

const PetProfilePage: NextPage<IPetProfilePage> = ({ pet, message }) => {
  const { t } = useTranslation('common');
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <PageLayout>
      <div className="p-10">
        {pet === null ? (
          <p>{message}</p>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <Carousel
              className="w-full max-w-xs lg:max-w-lg xl:max-w-xl"
              setApi={setApi}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent className="lg:max-h-[70vh]">
                {pet.photos?.map((photo, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={photo.large ?? '/no-profile-picture.svg'}
                      alt={`Pet photo ${index + 1}`}
                      className="rounded-md"
                      width={600}
                      height={400}
                      priority={true}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {pet.photos?.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
            {pet.photos?.length > 0 && (
              <div className="py-2 text-sm text-muted-foreground">
                {t('carousel_slide')} {current} {t('carousel_slide_of')} {count}
              </div>
            )}
            <div className="flex w-full gap-6">
              <Card className="rounded-lg bg-transparent p-6 lg:w-2/3">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center">
                      <h1 className="text-4xl font-bold">{pet.name}</h1>
                      <span
                        className="ml-4 cursor-pointer"
                        onClick={() => console.log(pet.id)}
                      >
                        <Icons.heart className="h-6 w-6 fill-none text-primary-400 transition hover:scale-110 hover:fill-current" />
                      </span>
                    </div>
                    <p className="pt-4 text-lg text-gray-700">
                      {pet.type} - {pet.breeds.primary} •{' '}
                      {pet.contact.address.city}, {pet.contact.address.state}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="flex items-center space-x-4 text-lg text-gray-800">
                    <li className="flex items-center">
                      <span className="mr-2">Age:</span>
                      <span className="font-bold text-primary-300">
                        {pet.age}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">Gender:</span>
                      <span className="font-bold text-primary-300">
                        {pet.gender}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">Size:</span>
                      <span className="font-bold text-primary-300">
                        {pet.size}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">Color:</span>
                      <span className="font-bold text-primary-300">
                        {pet.colors.primary ?? 'Unknown'}
                      </span>
                    </li>
                  </ul>
                  <Separator className="mt-6" />

                  {pet.description && (
                    <div className="mt-6">
                      <h2 className="mb-2 text-2xl font-bold">
                        About {pet.name}
                      </h2>
                      <p className="text-gray-700">{pet.description}</p>
                    </div>
                  )}

                  {[
                    pet.environment.children && 'Children',
                    pet.environment.dogs && 'Dogs',
                    pet.environment.cats && 'Cats',
                  ].filter(Boolean).length > 0 && (
                    <div className="mt-6">
                      <h2 className="mb-2 text-2xl font-bold">
                        Good in a home with
                      </h2>
                      <p className="text-gray-700">
                        {[
                          pet.environment.children && 'Children',
                          pet.environment.dogs && 'Dogs',
                          pet.environment.cats && 'Cats',
                        ]
                          .filter(Boolean)
                          .join(' / ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="rounded-lg bg-transparent p-6 lg:w-1/3">
                <CardContent>
                  <div className="mt-8 flex w-fit flex-col">
                    <h2 className="mb-2 text-2xl font-bold">
                      Considering adopting {pet.name}?
                    </h2>
                    <Button
                      className="w-fit rounded-full bg-primary-300 py-2 px-4 text-white hover:bg-primary-400"
                      onClick={() => console.log(pet.id)}
                    >
                      Inquire About Adoption
                    </Button>

                    <div className="flex items-center space-x-2 pt-6">
                      <span className="text-lg text-gray-900">Share:</span>
                      <Button
                        variant={'ghost'}
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Share on Facebook"
                      >
                        <Icons.facebook className="" />
                      </Button>
                    </div>
                    <div className="mt-6">
                      <h2 className="mb-2 text-2xl font-bold">
                        Organization Details
                      </h2>
                      <p className="w-fit text-base text-gray-700 decoration-primary-300 underline-offset-4 transition hover:text-primary-300 hover:underline">
                        <Link href={`/organization/${pet.organization_id}`}>
                          {pet.organization_id} - Go to Organization Page
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PetProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const id = query.id ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol as string}://${host as string}`
    : '';
  const locale = context.locale ?? 'en';

  const petfindetOauthData = (await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json())) as PetfinderOauth;
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    let url = 'https://api.petfinder.com/v2/animals?location=22152';
    if (id) {
      url = `https://api.petfinder.com/v2/animals/${id}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as PetfinderData;
    const pet = petfindetData?.animal;
    console.log(pet);

    if (pet) {
      return {
        props: {
          pet: pet,
          message: 'success',
          ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
        },
      };
    } else {
      return {
        props: {
          pet: null,
          message: `no animal found for id: ${id}`,
          ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
        },
      };
    }
  } else {
    return {
      props: {
        pet: null,
        message: 'no access token',
        ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
      },
    };
  }
};
