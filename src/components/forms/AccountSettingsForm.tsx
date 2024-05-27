import { zodResolver } from '@hookform/resolvers/zod';
import type { AddressInfo, User } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { env } from '~/env.mjs';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { UploadButton } from '~/lib/uploadthing';
import {
  userAccountDetailsSchema,
  type IUserAccountDetails,
} from '~/lib/validators/userValidation';
import { Icons } from '../icons/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/Avatar';
import { Button } from '../primitives/Button';
import { Card } from '../primitives/Card';
import Spinner from '../spinner/Spinner';
import BackgroundWavesFeaturedPets from '../utility/BackgroundWavesFeaturedPets';
import { RolesMap } from './AddPersonForm';

type Props = {
  user:
    | (User & {
        address: AddressInfo | null;
      })
    | null
    | undefined;
};

const AccountSettingsForm: FC<Props> = ({ user }) => {
  const router = useRouter();
  const trpc = api.useUtils();
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? '');

  const updateUserDetailsMutation = api.user.update.useMutation({
    retry: (count, error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        return false;
      }
      return count < 3;
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push(
          `/api/auth/signin?callbackUrl=${env.NEXT_PUBLIC_BASE_URL}/user/settings&error=SessionRequired`
        );
      }
    },
    onSuccess: async () => {
      await trpc.user.me.invalidate();
    },
  });

  const prefilledValues: IUserAccountDetails = useMemo(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      dateOfBirth: user?.dateOfBirth?.toISOString().slice(0, 10) ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      role: user?.role ?? Roles.Adopter,
      address: user?.address?.address ?? '',
      city: user?.address?.city ?? '',
      postCode: user?.address?.postCode ?? '',
      state: user?.address?.state ?? '',
      country: user?.address?.country ?? '',
      image: user?.image ?? '',
    }),
    [user]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<IUserAccountDetails>({
    defaultValues: prefilledValues,
    resolver: zodResolver(userAccountDetailsSchema),
  });

  useEffect(() => {
    setAvatarUrl(user?.image ?? '/images/no-profile-picture.svg');
    reset(prefilledValues);
  }, [user, reset, prefilledValues]);

  useEffect(() => {
    register('image', { value: avatarUrl });
  }, [register, avatarUrl]);

  const onSubmit: SubmitHandler<IUserAccountDetails> = async (data) => {
    await updateUserDetailsMutation.mutateAsync(data);
    toast({
      description: t('update_user_details_toast_success'),
      variant: 'success',
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl 2xl:max-w-8xl">
      <div className="absolute -z-10 w-full">
        <BackgroundWavesFeaturedPets className="aspect-[10/1] rotate-180" />
      </div>
      <div className="mt-10 sm:mt-0">
        <Card className="m-5 bg-card md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 sm:p-10">
                  <p className="mb-6 text-6xl font-light tracking-wide text-foreground underline decoration-2 underline-offset-4">
                    {t('update_user_details_form_title')}
                  </p>
                  <div className="grid grid-cols-6 gap-6 pb-20">
                    <div className="col-span-6 flex flex-col items-center justify-center gap-6 md:flex-row md:justify-start">
                      <Avatar className="col-span-5 h-64 w-64">
                        <AvatarImage
                          src={avatarUrl ?? '/images/no-profile-picture.svg'}
                          alt="Avatar image"
                        />
                        <AvatarFallback>
                          <span className="sr-only">{user?.name}</span>
                          <Icons.user className="h-24 w-24 opacity-70" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="items-center justify-center space-y-4 md:z-10">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            res && setAvatarUrl(res[0]?.url as string);
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
                            setValue('image', '');
                          }}
                        >
                          {t('remove_image')}
                        </Button>
                      </div>
                    </div>
                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="first-name"
                        autoComplete="given-name"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('firstName')}
                      />
                      <label
                        htmlFor="first-name"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('add_person_form_label_first_name')}
                      </label>
                      {errors.firstName && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.firstName?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="last-name"
                        autoComplete="family-name"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('lastName')}
                      />
                      <label
                        htmlFor="last-name"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('add_person_form_label_last_name')}
                      </label>
                      {errors.lastName && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.lastName?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-4">
                      <input
                        type="email"
                        id="email"
                        autoComplete="email"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('email')}
                      />
                      <label
                        htmlFor="email"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_email')}
                      </label>
                      {errors.email && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.email?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="date"
                        id="bday"
                        autoComplete="bday"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('dateOfBirth')}
                      />
                      <label
                        htmlFor="bday"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_dob')}
                      </label>
                      {errors.dateOfBirth && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.dateOfBirth?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="tel"
                        autoComplete="tel"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('phoneNumber')}
                      />
                      <label
                        htmlFor="tel"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_phone')}
                      </label>
                      {errors.phoneNumber && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.phoneNumber?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 sm:col-span-3">
                      <label
                        htmlFor="role"
                        className="absolute left-0 top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 text-sm font-semibold uppercase tracking-[0.25rem] text-primary-400/80"
                      >
                        {t('add_person_form_label_role')}
                      </label>
                      <select
                        id="role"
                        className="absolute left-0 top-6 mt-1 block w-full rounded-md border border-neutral-50 bg-white px-3 py-2 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-primary-400 sm:text-sm"
                        {...register('role')}
                      >
                        {userAccountDetailsSchema.shape.role.options.map(
                          (op) => (
                            <option
                              key={op.value}
                              value={op.value}
                            >
                              {RolesMap[op.value]}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <p className="col-span-6 mb-4 mt-12 text-3xl font-light tracking-widest text-foreground underline decoration-2 underline-offset-2 sm:text-4xl">
                    {t('update_user_details_form_title_address')}
                  </p>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-4">
                      <input
                        type="text"
                        id="address"
                        autoComplete="street-address"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('address')}
                      />
                      <label
                        htmlFor="address"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_address')}
                      </label>
                      {errors.address && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.address?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="city"
                        autoComplete="address-level2"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('city')}
                      />
                      <label
                        htmlFor="city"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_city')}
                      </label>
                      {errors.city && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.city?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="state"
                        autoComplete="address-level1"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('state')}
                      />
                      <label
                        htmlFor="state"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_state')}
                      </label>
                      {errors.state && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.state?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('postCode')}
                      />
                      <label
                        htmlFor="postal-code"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_zip_code')}
                      </label>
                      {errors.postCode && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.postCode?.message}
                        </p>
                      )}
                    </div>

                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="country"
                        autoComplete="country-name"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-foreground outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('country')}
                      />
                      <label
                        htmlFor="country"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        {t('form_label_country')}
                      </label>
                      {errors.country && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.country?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-left sm:p-10">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-400/90 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled={updateUserDetailsMutation.isPending}
                  >
                    {updateUserDetailsMutation.isPending ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      t('form_button_save')
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettingsForm;
