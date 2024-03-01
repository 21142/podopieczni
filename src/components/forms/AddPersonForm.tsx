import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/lib/api';
import { UploadButton } from '~/lib/uploadthing';
import {
  userAccountDetailsSchema,
  type IUserAccountDetails,
} from '~/lib/validators/userValidation';
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

const AddPersonForm = () => {
  const trpc = api.useContext().user;
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState('');
  const { t } = useTranslation('common');

  const addUserMutation = api.user.add.useMutation({
    onSuccess: async () => {
      await trpc.getAllUsers.invalidate();
    },
  });

  const form = useForm<IUserAccountDetails>({
    resolver: zodResolver(userAccountDetailsSchema),
  });

  const onSubmit = async (values: IUserAccountDetails) => {
    try {
      await addUserMutation.mutateAsync(values);
      toast({
        description: t('add_person_form_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        role: undefined,
        address: '',
        city: '',
        postCode: '',
        state: '',
        country: '',
        image: '',
      });
      setAvatarUrl('');
    }
  };

  return (
    <div className="px-4 pb-4">
      <BackgroundWavesFeaturedPets className="absolute -z-10 aspect-[10/1] w-full rotate-180" />
      <Card className="mx-auto mt-4 w-full max-w-7xl p-4 px-4 py-5 sm:mt-6 sm:p-10 2xl:max-w-8xl">
        <CardHeader className="px-0 pt-2">
          <h1 className="mb-6 font-sans text-4xl tracking-wide text-foreground underline decoration-2 underline-offset-4 sm:text-6xl">
            {t('add_person_form_title')}
          </h1>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6 md:grid md:grid-cols-2 md:gap-6"
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
                      res && setAvatarUrl(res[0]?.fileUrl as string);
                      res && form.setValue('image', res[0]?.fileUrl as string);
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
                    Remove Image
                  </Button>
                </div>
              </div>
            </div>
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
                  <FormLabel>{t('add_person_form_label_email')}</FormLabel>
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
                      className="border-b-2 border-t-0 border-l-0 border-r-0"
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
                  <FormLabel>{t('add_person_form_label_phone')}</FormLabel>
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
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_address')}</FormLabel>
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_city')}</FormLabel>
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
              name="postCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_zip_code')}</FormLabel>
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_state')}</FormLabel>
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('add_person_form_label_country')}</FormLabel>
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
              onClick={async () => await trpc.getAllUsers.invalidate()}
              disabled={addUserMutation.isLoading}
            >
              {addUserMutation.isLoading ? (
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

export default AddPersonForm;
