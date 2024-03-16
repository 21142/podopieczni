import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'next-share';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
import dayjs from '~/lib/dayjs';
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
  const router = useRouter();
  const { locale } = router;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isLikeClicked, setIsLikeClicked] = React.useState(false);

  dayjs.locale(locale);

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

  const handleLikeClick = () => {
    if (!isLikeClicked) {
      console.log(
        'TODO: add mutation to tag as favorite pet with id: ',
        pet.id
      );
    } else {
      console.log(
        'TODO: add mutation to remove from favorites pet with id: ',
        pet.id
      );
    }
    setIsLikeClicked((prev) => !prev);
  };

  const iconsAndText = [
    pet.environment.children && {
      icon: (
        <Icons.baby
          key="baby"
          className="h-6 w-6"
        />
      ),
      text: t('pet_profile_page_good_with_children'),
    },
    pet.environment.dogs && {
      icon: (
        <Icons.dog
          key="dog"
          className="h-6 w-6"
        />
      ),
      text: t('pet_profile_page_good_with_dogs'),
    },
    pet.environment.cats && {
      icon: (
        <Icons.cat
          key="cat"
          className="h-6 w-6"
        />
      ),
      text: t('pet_profile_page_good_with_cats'),
    },
  ];

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-8xl p-6">
        {pet === null ? (
          <p>{message}</p>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <Carousel
              className="w-full max-w-[15rem] md:max-w-xs lg:max-w-lg xl:max-w-xl"
              setApi={setApi}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent className="lg:max-h-[70vh]">
                {pet.photos?.map((photo, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={photo.large ?? '/images/no-profile-picture.svg'}
                      alt={`Pet photo ${index + 1}`}
                      className="h-full w-full rounded-sm object-cover"
                      width={600}
                      height={600}
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
            <div className="flex w-full flex-col gap-6 lg:flex-row">
              <Card className="rounded-lg bg-transparent lg:w-2/3 lg:p-6">
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center">
                      <h1 className="text-4xl font-bold">{pet.name}</h1>
                      <span className="ml-4">
                        <Icons.heart
                          onClick={handleLikeClick}
                          className={`cursor-pointer text-primary-400 transition-all ease-in-out hover:scale-110 ${
                            isLikeClicked ? 'fill-primary-300' : ''
                          }`}
                        />
                      </span>
                    </div>
                    <p className="pt-4 text-lg ">
                      {pet.type} • {pet.breeds.primary} •{' '}
                      {pet.contact.address.city}, {pet.contact.address.state}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="flex flex-col items-start space-y-4 text-lg md:flex-row md:space-x-4 md:space-y-0">
                    <li className="flex items-center">
                      <span className="mr-2">{t('pet_profile_page_age')}</span>
                      <span className="font-bold text-primary-300">
                        {pet.age}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">
                        {t('pet_profile_page_gender')}
                      </span>
                      <span className="font-bold text-primary-300">
                        {pet.gender}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">{t('pet_profile_page_size')}</span>
                      <span className="font-bold text-primary-300">
                        {pet.size}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">
                        {t('pet_profile_page_color')}
                      </span>
                      <span className="font-bold text-primary-300">
                        {pet.colors.primary ?? 'Unknown'}
                      </span>
                    </li>
                  </ul>
                  <Separator className="mt-6" />

                  {pet.description && (
                    <div className="mt-6">
                      <h2 className="mb-2 text-2xl font-bold">
                        {t('pet_profile_page_pet_description', {
                          name: pet.name,
                        })}
                      </h2>
                      <p className="">{pet.description}</p>
                    </div>
                  )}

                  {iconsAndText.length > 0 && (
                    <div className="mt-6">
                      <h2 className="mb-4 text-2xl font-bold">
                        {t('pet_profile_page_good_with')}
                      </h2>
                      <div className="flex flex-wrap">
                        {iconsAndText.map((item, index) => (
                          <div
                            className="mr-4 flex flex-col items-center"
                            key={index}
                          >
                            {typeof item !== 'boolean' && item?.icon}
                            {typeof item !== 'boolean' && item?.text && (
                              <span className="text-base">{item.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="mt-6" />
                  <div className="flex flex-col justify-between pt-6">
                    <h2 className="mb-2 text-xl font-bold">
                      {t('pet_profile_page_how_long', { name: pet.name })}
                    </h2>
                    <div className="flex items-end gap-4">
                      <p className="text-lg">
                        {dayjs(pet.published_at).fromNow(true)}
                      </p>
                    </div>
                  </div>
                  <Separator className="mt-6" />
                  <div className="flex flex-col justify-between pt-6">
                    <h2 className="mb-2 text-xl font-bold">
                      {t('pet_profile_page_help')}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="text-base md:text-lg">
                        {t('pet_profile_page_share')}
                      </span>
                      <FacebookShareButton url={pet.url}>
                        <FacebookIcon
                          size={32}
                          round
                        />
                      </FacebookShareButton>
                      <LinkedinShareButton url={pet.url}>
                        <LinkedinIcon
                          size={32}
                          round
                        />
                      </LinkedinShareButton>
                      <TwitterShareButton url={pet.url}>
                        <TwitterIcon
                          size={32}
                          round
                        />
                      </TwitterShareButton>
                      <WhatsappShareButton url={pet.url}>
                        <WhatsappIcon
                          size={32}
                          round
                        />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-lg bg-transparent lg:w-1/3 lg:p-6">
                <CardHeader>
                  <CardTitle className="mb-4 text-3xl font-bold">
                    {t('pet_profile_want_to_adopt', { name: pet.name })}
                  </CardTitle>
                  <Button
                    className="w-fit rounded-full px-5 md:px-12"
                    variant="primary"
                    onClick={() => console.log(pet.id)}
                  >
                    {t('pet_profile_inquire_about_adoption')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Separator className="my-6" />
                  <div className="flex w-fit flex-col">
                    <div className="mt-6">
                      <h2 className="mb-2 text-2xl font-bold">
                        {t('pet_profile_shelter')}
                      </h2>
                      <p className="w-fit text-base decoration-primary-300 underline-offset-4 transition hover:text-primary-300 hover:underline">
                        <Link href={`/organization/${pet.organization_id}`}>
                          {pet.organization_id} •{' '}
                          {t('pet_profile_shelter_link')}
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="py-6 px-6 sm:px-12 lg:px-48">
              <Button
                onClick={() => router.back()}
                className="hover:text-primary focus:text-primary text-md group flex items-center justify-center gap-x-0.5 font-sans text-gray-600 transition ease-out focus:outline-none"
                variant="link"
              >
                <Icons.chevronLeft className="h-5 w-5" />
                {t('go_back')}
              </Button>
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
