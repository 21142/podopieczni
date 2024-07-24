import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import { Button, buttonVariants } from '~/components/primitives/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/primitives/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/primitives/Popover';
import Spinner from '~/components/spinner/Spinner';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import { ssghelpers } from '~/lib/ssg';
import { cn } from '~/lib/utils';

const AssociateShelter: NextPage = () => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { toast } = useToast();

  if (!session) {
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );
  }

  const {
    data: isUserAssociatedWithShelter,
    isLoading: isLoadingUserAssociation,
  } = api.user.isUserAssociatedWithShelter.useQuery(undefined, {
    enabled: session?.user !== undefined,
    retry: false,
  });

  const {
    data: sheltersNames,
    isLoading,
    isError,
  } = api.shelter.getSheltersNames.useQuery();

  const requestToJoinShelterMutation =
    api.shelter.requestToJoinShelter.useMutation({
      onSuccess: () => {
        toast({
          description: t('request_to_join_shelter_toast_success'),
          variant: 'success',
        });
        setTimeout(() => {
          router.push(links.checkInboxForInviteDecision);
        }, 5000);
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  if (isLoadingUserAssociation) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (isUserAssociatedWithShelter) {
    router.push(links.dashboard);
  }

  return (
    <PageLayout>
      {!isUserAssociatedWithShelter && (
        <div className="grid h-[50vh] content-center justify-center gap-6 p-3 text-center">
          <h1 className="text-center text-2xl font-semibold">
            {t('shelter_associate_title')}
          </h1>
          <p className="max-w-2xl">{t('shelter_associate_subtitle')}</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="combobox"
                role="combobox"
                className={'w-full justify-between'}
              >
                {selectedValue
                  ? selectedValue
                  : t('add_pet_form_placeholder_shelter')}{' '}
                <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              {isLoading && <div>Loading...</div>}
              {isError && <div>Error fetching shelters names.</div>}
              {sheltersNames && (
                <Command>
                  <CommandInput
                    placeholder={t('add_pet_form_placeholder_shelter')}
                  />
                  <CommandEmpty>No shelters found.</CommandEmpty>
                  <CommandGroup>
                    {sheltersNames.map((shelterName) => (
                      <CommandItem
                        value={shelterName.name}
                        key={shelterName.name}
                        onSelect={() => {
                          setSelectedValue(shelterName.name);
                        }}
                      >
                        <Icons.check
                          className={cn(
                            'mr-2 h-4 w-4',
                            shelterName.name == selectedValue
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {shelterName.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              )}
            </PopoverContent>
          </Popover>
          <div className="flex items-center justify-center gap-5">
            <Button
              variant="default"
              size="lg"
              disabled={!selectedValue}
              onClick={() =>
                requestToJoinShelterMutation.mutateAsync({
                  shelterName: selectedValue,
                })
              }
            >
              {t('shelter_associate_button')}
            </Button>
            <p className="text-sm">or</p>
            <Link
              href={links.registerShelter}
              className={buttonVariants({ variant: 'default', size: 'lg' })}
            >
              {t('shelter_registration_button')}
            </Link>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AssociateShelter;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.user.isUserAssociatedWithShelter.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
