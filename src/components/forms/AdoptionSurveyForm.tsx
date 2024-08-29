import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
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
import { Button } from '../primitives/Button';
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
  petId: string;
};

const AdoptionSurveyForm: FC<Props> = ({ petId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  const submitAdoptionInquiryMutation =
    api.adoptionApplication.create.useMutation({
      onSuccess: () => {
        setTimeout(() => {
          router.push(links.confirmation);
        }, 3000);
      },
    });

  const { data: userDetails } = api.user.getUserById.useQuery({
    id: session?.user.id ?? '',
  });

  const form = useForm<IAdoptionSurvey>({
    resolver: zodResolver(adoptionSurveySchema),
    defaultValues: {
      firstName: userDetails?.firstName ?? '',
      lastName: userDetails?.lastName ?? '',
      email: userDetails?.email ?? '',
      phoneNumber: userDetails?.phoneNumber ?? '',
      address: {
        address: userDetails?.address?.address ?? '',
        city: userDetails?.address?.city ?? '',
        postCode: userDetails?.address?.postCode ?? '',
        state: userDetails?.address?.state ?? '',
        country: userDetails?.address?.country ?? '',
      },
    },
  });

  const onSubmit = async (values: IAdoptionSurvey) => {
    try {
      await submitAdoptionInquiryMutation.mutateAsync({ petId, data: values });
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

  return (
    <div className="p-4 sm:p-0 sm:pb-4">
      <BackgroundWavesFeaturedPets className="absolute -z-10 aspect-[10/1] w-full rotate-180" />
      <Card className="mx-auto mt-4 w-full max-w-7xl p-4 px-4 py-5 sm:mt-6 sm:p-10 2xl:max-w-8xl">
        <CardHeader className="px-0 pt-2">
          <h1 className="mb-6 font-sans text-4xl tracking-wide text-foreground underline decoration-2 underline-offset-4 sm:text-6xl">
            {t('adoption_survey_form_title')}
          </h1>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-6"
          >
            <FormField
              control={form.control}
              name="reasonForAdoption"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('form_label_reason_for_adoption')}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="col-span-2 justify-self-start"
              size="lg"
              disabled={submitAdoptionInquiryMutation.isPending}
            >
              {submitAdoptionInquiryMutation.isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t('form_button_send')
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdoptionSurveyForm;
