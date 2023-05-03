import { zodResolver } from '@hookform/resolvers/zod';
import type { AddressInfo, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { api, getBaseUrl } from '~/utils/api';
import {
  userAccountDetailsSchema,
  type IUserAccountDetails,
} from '~/utils/validation/user';
import { RolesMap } from './UserForm';

export interface Props {
  user:
    | (User & {
        address: AddressInfo | null;
      })
    | null
    | undefined;
}

const AccountSettingsForm: FC<Props> = ({ user }) => {
  const router = useRouter();
  const trpc = api.useContext();

  const updateUserDetailsMutation = api.user.update.useMutation({
    retry: (count, error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        return false;
      }
      return count < 3;
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        void router.push(
          `/api/auth/signin?callbackUrl=${getBaseUrl()}/user/settings&error=SessionRequired`
        );
      }
    },
    onSuccess: async () => {
      await trpc.user.me.invalidate();
    },
  });

  const prefilledValues: IUserAccountDetails = useMemo(() => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    dateOfBirth: user?.dateOfBirth?.toISOString().slice(0, 10) ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    role: user?.role ?? 'Adopter',
    address: user?.address?.address ?? '',
    city: user?.address?.city ?? '',
    postCode: user?.address?.postCode ?? '',
    state: user?.address?.state ?? '',
    country: user?.address?.country ?? '',
  }), [user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserAccountDetails>({
    defaultValues: prefilledValues,
    resolver: zodResolver(userAccountDetailsSchema),
  });

  useEffect(() => {
    reset(prefilledValues);
  }, [user, reset, prefilledValues]);

  const onSubmit: SubmitHandler<IUserAccountDetails> = async (data) => {
    await updateUserDetailsMutation.mutateAsync(data);
  };

  return (
    <div className="mx-auto w-full max-w-7xl 2xl:max-w-8xl">
      <div className="mt-10 sm:mt-0">
        <div className="m-5 md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <p className="my-4 text-3xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    Your profile
                  </p>

                  <div className="grid grid-cols-6 gap-6 pb-20">
                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-3">
                      <input
                        type="text"
                        id="first-name"
                        autoComplete="given-name"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('firstName')}
                      />
                      <label
                        htmlFor="first-name"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        First name
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('lastName')}
                      />
                      <label
                        htmlFor="last-name"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Last name
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('email')}
                      />
                      <label
                        htmlFor="email"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Email address
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('dateOfBirth')}
                      />
                      <label
                        htmlFor="bday"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Date of birth
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('phoneNumber')}
                      />
                      <label
                        htmlFor="tel"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Phone number
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
                        className="absolute top-4 left-0 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 text-sm font-semibold uppercase tracking-[0.25rem] text-primary-400/80"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        className="absolute top-6 left-0 mt-1 block w-full rounded-md border border-neutral-50 bg-white py-2 px-3 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-primary-400 sm:text-sm"
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

                  <p className="col-span-6 mt-12 mb-4 text-3xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    Your address details
                  </p>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="relative z-0 col-span-6 min-w-[16rem] sm:col-span-4">
                      <input
                        type="text"
                        id="address"
                        autoComplete="street-address"
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('address')}
                      />
                      <label
                        htmlFor="address"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Correspondence address
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('city')}
                      />
                      <label
                        htmlFor="city"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        City
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('state')}
                      />
                      <label
                        htmlFor="state"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        State
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('postCode')}
                      />
                      <label
                        htmlFor="postal-code"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Post code
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
                        className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder=" "
                        {...register('country')}
                      />
                      <label
                        htmlFor="country"
                        className="absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light uppercase tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
                      >
                        Country
                      </label>
                      {errors.country && (
                        <p className="my-2 text-sm text-red-600">
                          {errors.country?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-0 px-4 py-3 text-left sm:px-6 sm:py-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-400/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled={updateUserDetailsMutation.isLoading}
                  >
                    {updateUserDetailsMutation.isLoading
                      ? 'Zapisuje...'
                      : 'Zapisz zmiany'}{' '}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsForm;
