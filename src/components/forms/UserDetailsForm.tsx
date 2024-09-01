import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import { voivodships } from '~/lib/constants';
import { UploadButton } from '~/lib/uploadthing';
import {
  userAccountDetailsSchema,
  type IUserAccountDetails,
} from '~/lib/validators/userValidation';
import { type UserDetailsDto } from '~/types';
import { Icons } from '../icons/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/Avatar';
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
import Spinner from '../spinner/Spinner';
import BackgroundWavesFeaturedPets from '../utility/BackgroundWavesFeaturedPets';

export const RolesMap: Record<
  z.infer<typeof userAccountDetailsSchema>['role'],
  string
> = {
  Adopter: 'Adopter',
  Shelter: 'Shelter',
  Admin: 'Admin',
};

type Props = {
  user: UserDetailsDto;
};

const UserDetailsForm: FC<Props> = ({ user }) => {
  const trpc = api.useUtils();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? '');
  const { t } = useTranslation('common');

  const updateUserDetails = api.user.update.useMutation({
    onSuccess: async () => {
      await trpc.user.getAllPeopleAssociatedWithShelter.invalidate();
    },
  });

  const form = useForm<IUserAccountDetails>({
    resolver: zodResolver(userAccountDetailsSchema),
    defaultValues: {
      ...user,
      dateOfBirth: user?.dateOfBirth?.toISOString().split('T')[0],
    } as IUserAccountDetails,
  });

  const onSubmit = async (values: IUserAccountDetails) => {
    try {
      await updateUserDetails.mutateAsync(values);
      toast({
        description: t('update_user_details_form_toast_success'),
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
    <div className="pb-4">
      <BackgroundWavesFeaturedPets className="absolute -z-10 aspect-[10/1] w-full rotate-180" />
      <Card className="mx-auto mt-4 w-full max-w-7xl p-4 px-4 py-5 sm:mt-6 sm:p-10 2xl:max-w-8xl">
        {user?.name && (
          <CardHeader className="mx-auto max-w-7xl px-0 pt-2">
            <h1 className="mb-6 font-sans text-4xl tracking-wide text-foreground underline decoration-2 underline-offset-4 sm:text-6xl">
              {user.name}
            </h1>
          </CardHeader>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto flex max-w-7xl flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-6"
          >
            <div className="col-span-2 flex justify-center gap-6 md:justify-start">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <Avatar className="col-span-5 h-64 w-64">
                  <AvatarImage
                    src={avatarUrl ?? '/images/no-profile-picture.svg'}
                    alt="Avatar image"
                  />
                  <AvatarFallback>
                    <Icons.user className="h-24 w-24 opacity-70" />
                  </AvatarFallback>
                </Avatar>
                <div className="items-center justify-center space-y-4 md:z-10 md:mt-10">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      res && setAvatarUrl(res[0]?.url as string);
                      res && form.setValue('image', res[0]?.url as string);
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        description: error.message,
                        variant: 'destructive',
                      });
                    }}
                    onUploadProgress={() => {
                      <Spinner />;
                    }}
                  />
                  <Button
                    className="text-base"
                    variant={'destructive'}
                    size="lg"
                    disabled={!avatarUrl || avatarUrl === ''}
                    onClick={() => {
                      setAvatarUrl('');
                      form.setValue('image', '');
                    }}
                  >
                    {t('remove_image')}
                  </Button>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2 space-y-1 sm:col-span-2">
                  <FormLabel>{t('add_person_form_label_title')}</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    className="max-w grid grid-cols-3 gap-6 pt-2 sm:grid-cols-4"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value={t('add_person_form_mrs')}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('add_person_form_mrs')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value={t('add_person_form_mr')}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('add_person_form_mr')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                        <FormControl>
                          <RadioGroupItem
                            value={t('add_person_form_dr')}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                          <span className="block w-full p-2 text-center text-base font-normal">
                            {t('add_person_form_dr')}
                          </span>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden lg:col-span-2 lg:block lg:h-6" />
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_label_dob')}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="border-b-2 border-l-0 border-r-0 border-t-0"
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_role')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_person_form_placeholder_role')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userAccountDetailsSchema.shape.role.options.map((op) => (
                        <SelectItem
                          key={op.value}
                          value={op.value}
                        >
                          {RolesMap[op.value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('form_label_state_placeholder')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {voivodships.map((voivodship) => (
                        <SelectItem
                          key={voivodship.name}
                          value={voivodship.name}
                        >
                          {voivodship.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              disabled={!form.formState.isDirty}
            >
              {updateUserDetails.isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t('form_button_save')
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default UserDetailsForm;
