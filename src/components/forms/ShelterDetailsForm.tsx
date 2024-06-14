import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { UploadButton } from '@uploadthing/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';
import { links } from '~/config/siteConfig';
import { toast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import {
  shelterSettingsSchema,
  type IShelterSettings,
} from '~/lib/validators/shelterValidation';
import { type fileRouter } from '~/server/api/routers/uploadthing';
import { type ShelterDetails } from '~/types';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../primitives/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';
import { Textarea } from '../primitives/Textarea';

type Props = {
  shelterDetails: ShelterDetails;
};

const ShelterDetailsForm = ({ shelterDetails }: Props) => {
  const trpc = api.useUtils();
  const { t } = useTranslation('common');
  const router = useRouter();

  const [logo, setLogo] = useState(
    shelterDetails?.logo ?? '/images/no-profile-picture.svg'
  );

  const upsertShelterSettingsMutation =
    api.shelter.upsertShelterDetails.useMutation({
      onSuccess: async () => {
        await trpc.shelter.getShelterDetails.invalidate();
        await trpc.user.isUserAssociatedWithShelter.invalidate();
      },
    });

  const form = useForm<IShelterSettings>({
    resolver: zodResolver(shelterSettingsSchema),
    defaultValues: {
      ...shelterDetails,
      website: shelterDetails?.website || '-',
      description: shelterDetails?.description || '-',
      phoneNumber: shelterDetails?.phoneNumber || '-',
      email: shelterDetails?.email || 'provideyouremail@example.com',
      address: {
        ...shelterDetails?.address,
        address: shelterDetails?.address?.address || '-',
        city: shelterDetails?.address?.city || '-',
        state: shelterDetails?.address?.state || '-',
        country: shelterDetails?.address?.country || '-',
        postCode: shelterDetails?.address?.postCode || '-',
      },
    },
  });

  const onSubmit = async (values: IShelterSettings) => {
    try {
      await upsertShelterSettingsMutation.mutateAsync({ ...values });
      toast({
        description: t('update_shelter_form_toast_success', {
          name: values.name,
        }),
        variant: 'success',
      });
      router.push(links.dashboard);
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <main className="my-6 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4 sm:max-w-7xl">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <h1 className="relative flex-1 shrink-0 whitespace-nowrap text-3xl font-semibold tracking-tight sm:grow-0">
                {shelterDetails?.name ?? t('register_shelter_title')}
              </h1>
              <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                {shelterDetails?.taxId ? (
                  <Badge variant="success">{t('verified')}</Badge>
                ) : (
                  <Badge variant="destructive">{t('unverified')}</Badge>
                )}
                <Button
                  size="sm"
                  type="submit"
                  className="text-xs"
                  disabled={!form.formState.isDirty || !form.formState.isValid}
                >
                  {t('form_save_changes_button')}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_350px] lg:grid-cols-7 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-5 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      {t('shelter_details')}
                    </CardTitle>
                    <CardDescription className="pt-1">
                      {t('shelter_details_subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>
                              {t('shelter_settings_form_label_name')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>
                              {t('shelter_settings_form_label_website')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>{t('description_label')}</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      {t('contact_details')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>{t('form_label_phone')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>{t('form_label_email')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      {t('address_details')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="address.address"
                        render={({ field }) => (
                          <FormItem className="col-span-2 grid gap-3">
                            <FormLabel>{t('form_label_address')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem className="col-span-2 grid gap-3 sm:col-span-1">
                            <FormLabel>{t('form_label_city')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem className="col-span-2 grid gap-3 sm:col-span-1">
                            <FormLabel>{t('form_label_state')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem className="col-span-2 grid gap-3 sm:col-span-1">
                            <FormLabel>{t('form_label_country')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.postCode"
                        render={({ field }) => (
                          <FormItem className="col-span-2 grid gap-3 sm:col-span-1">
                            <FormLabel>{t('form_label_zip_code')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      Logo
                    </CardTitle>
                    <CardDescription>{t('logo_subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Organization logo"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        width="300"
                        src={logo ?? '/images/no-profile-picture.svg'}
                      />
                      <div className="mt-4 grid place-items-center">
                        <UploadButton<fileRouter>
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              res && setLogo(res[0]?.url as string);
                              res &&
                                form.setValue('logo', res[0]?.url as string);
                              toast({
                                description: t(
                                  'pet_image_toast_upload_success'
                                ),
                                variant: 'success',
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              description: error.message,
                              variant: 'destructive',
                            });
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      {t('legal_details')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem className="grid gap-3">
                            <FormLabel>{t('form_label_taxid')}</FormLabel>
                            <FormControl>
                              <Input
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </form>
    </Form>
  );
};

export default ShelterDetailsForm;
