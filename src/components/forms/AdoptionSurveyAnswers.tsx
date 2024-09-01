import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import {
  adoptionSurveySchema,
  type IAdoptionSurvey,
} from '~/lib/validators/adoptionSurveyValidation';
import { Icons } from '../icons/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/Avatar';
import { Badge, type BadgeProps } from '../primitives/Badge';
import { Button, buttonVariants } from '../primitives/Button';
import { Card, CardHeader } from '../primitives/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';
import { RadioGroup, RadioGroupItem } from '../primitives/RadioButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/Select';
import { Textarea } from '../primitives/Textarea';
import BackgroundWavesFeaturedPets from '../utility/BackgroundWavesFeaturedPets';

type HouseholdSize = z.infer<typeof adoptionSurveySchema>['householdSize'];

export const HouseholdSizeMap: Record<HouseholdSize, string> = {
  Dom: 'Dom',
  Mieszkanie: 'Mieszkanie',
};

type Props = {
  applicationId: string;
};

const AdoptionSurveyAnswers: FC<Props> = ({ applicationId }) => {
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const trpc = api.useUtils();

  const acceptAdoptionApplicationMutation =
    api.adoptionApplication.acceptApplication.useMutation({
      onSuccess: async () => {
        await trpc.adoptionApplication.getApplicationById.invalidate();
      },
    });

  const rejectAdoptionApplicationMutation =
    api.adoptionApplication.rejectApplication.useMutation({
      onSuccess: async () => {
        await trpc.adoptionApplication.getApplicationById.invalidate();
      },
    });

  const markAdoptionApplicationAsContactedMutation =
    api.adoptionApplication.markAsContacted.useMutation({
      onSuccess: async () => {
        await trpc.adoptionApplication.getApplicationById.invalidate();
      },
    });

  const { data: adoptionSurveyData } =
    api.adoptionApplication.getApplicationById.useQuery(applicationId, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const form = useForm<IAdoptionSurvey>({
    resolver: zodResolver(adoptionSurveySchema),
    defaultValues: adoptionSurveyData as IAdoptionSurvey,
  });

  const acceptAdoptionApplication = async () => {
    try {
      await acceptAdoptionApplicationMutation.mutateAsync(applicationId);
      toast({
        description: t('adoption_survey_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const rejectAdoptionApplication = async () => {
    try {
      await rejectAdoptionApplicationMutation.mutateAsync(applicationId);
      toast({
        description: t('adoption_survey_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const markAdoptionApplicationAsContacted = async () => {
    try {
      await markAdoptionApplicationAsContactedMutation.mutateAsync(
        applicationId
      );
      toast({
        description: t('adoption_survey_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const getBadgeVariant = (
    status: ApplicationStatus
  ): { variant: BadgeProps['variant'] } => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return { variant: 'success' };
      case ApplicationStatus.REJECTED:
        return { variant: 'destructive' };
      case ApplicationStatus.CONTACTED:
        return { variant: 'success' };
      case ApplicationStatus.PENDING:
      default:
        return { variant: 'default' };
    }
  };

  const getBadgeText = (status: ApplicationStatus): string => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return 'accepted';
      case ApplicationStatus.REJECTED:
        return 'rejected';
      case ApplicationStatus.CONTACTED:
        return 'marked_as_contacted';
      case ApplicationStatus.PENDING:
      default:
        return 'pending';
    }
  };

  if (!adoptionSurveyData) return <p>No adoption application found</p>;

  const { variant } = getBadgeVariant(adoptionSurveyData.status);

  return (
    <div className="p-4 sm:p-0 sm:pb-4">
      <BackgroundWavesFeaturedPets className="absolute -z-10 aspect-[10/1] w-full rotate-180" />
      <Card className="mx-auto mt-4 w-full max-w-7xl p-4 px-4 py-5 sm:mt-6 sm:p-10 2xl:max-w-8xl">
        <CardHeader className="mx-auto max-w-7xl px-0 pb-12 pt-0">
          <h1 className="my-6 font-sans text-4xl tracking-wide text-foreground underline decoration-2 underline-offset-4 sm:text-6xl">
            {t('adoption_survey_form_title')}
          </h1>
          <div className="relative flex items-center gap-6 py-6">
            <Badge
              className="absolute -top-2 left-0"
              variant={variant}
            >
              {t(getBadgeText(adoptionSurveyData.status))}
            </Badge>
            <Avatar className="h-28 w-28 sm:h-44 sm:w-44">
              <AvatarImage
                src={adoptionSurveyData?.user?.image ?? undefined}
                alt={
                  adoptionSurveyData?.user?.firstName ?? 'User profile photo'
                }
              />
              <AvatarFallback>
                <span className="sr-only">User image fallback</span>
                {adoptionSurveyData?.user
                  ? `${adoptionSurveyData.user?.firstName} ${adoptionSurveyData.user?.lastName}`
                  : `${adoptionSurveyData.firstName} ${adoptionSurveyData.lastName}`}
              </AvatarFallback>
            </Avatar>
            <Icons.arrows className="h-8 w-8" />
            <Avatar className="h-28 w-28 sm:h-44 sm:w-44">
              <AvatarImage
                src={
                  adoptionSurveyData?.pet.image ??
                  '/images/no-profile-picture.svg'
                }
                alt={adoptionSurveyData?.pet.name ?? 'Pet profile photo'}
              />
              <AvatarFallback>
                <span className="sr-only">Pet image fallback</span>
                <Icons.dog className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <Form {...form}>
          <form className="mx-auto flex max-w-7xl flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-6">
            <FormField
              control={form.control}
              name="reasonForAdoption"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('form_label_reason_for_adoption')}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('form_label_experience')}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasPets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_label_has_pets')}</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    className="max-w grid grid-cols-2 gap-8 pt-2"
                    disabled
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value="true"
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('pet_form_yes')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value="false"
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('pet_form_no')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasChildren"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>{t('form_label_has_children')}</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    className="max-w grid grid-cols-2 gap-8 pt-2"
                    disabled
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value="true"
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('pet_form_yes')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value="false"
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('pet_form_no')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="householdSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_label_household')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('form_label_household_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adoptionSurveySchema.shape.householdSize.options.map(
                        (op) => (
                          <SelectItem
                            key={op.value}
                            value={op.value}
                          >
                            {HouseholdSizeMap[op.value]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden lg:col-span-2 lg:block lg:h-12" />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_first_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_last_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
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
                <FormItem>
                  <FormLabel>{t('form_label_email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_label_phone')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="hidden lg:col-span-2 lg:block lg:h-12" />
            <FormField
              control={form.control}
              name="address.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_label_address')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
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
                <FormItem>
                  <FormLabel>{t('form_label_city')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
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
                <FormItem>
                  <FormLabel>{t('form_label_zip_code')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
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
                <FormItem>
                  <FormLabel>{t('form_label_state')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
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
                <FormItem>
                  <FormLabel>{t('form_label_country')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-4">
            <Link
              className={buttonVariants({ variant: 'subtle', size: 'lg' })}
              href={links.adoptions}
            >
              <Icons.chevronLeft className="h-5 w-5" />
              {t('go_back')}
            </Link>
            <Button
              className=""
              size="lg"
              onClick={markAdoptionApplicationAsContacted}
              disabled={
                markAdoptionApplicationAsContactedMutation.isPending ||
                adoptionSurveyData?.status === 'CONTACTED'
              }
            >
              {markAdoptionApplicationAsContactedMutation.isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : adoptionSurveyData?.status === 'CONTACTED' ? (
                t('marked_as_contacted')
              ) : (
                t('marked_as_contacted')
              )}
            </Button>
            <Button
              className=""
              size="lg"
              variant="success"
              onClick={acceptAdoptionApplication}
              disabled={
                acceptAdoptionApplicationMutation.isPending ||
                adoptionSurveyData?.status === 'APPROVED'
              }
            >
              {acceptAdoptionApplicationMutation.isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : adoptionSurveyData?.status === 'APPROVED' ? (
                t('accepted')
              ) : (
                t('accept')
              )}
            </Button>
            <Button
              className=""
              size="lg"
              variant="destructive"
              onClick={rejectAdoptionApplication}
              disabled={
                rejectAdoptionApplicationMutation.isPending ||
                adoptionSurveyData?.status === 'REJECTED'
              }
            >
              {rejectAdoptionApplicationMutation.isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : adoptionSurveyData?.status === 'REJECTED' ? (
                t('rejected')
              ) : (
                t('reject')
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdoptionSurveyAnswers;
