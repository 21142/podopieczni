import { zodResolver } from '@hookform/resolvers/zod';
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
import Spinner from '../spinners/Spinner';

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
        description: 'User successfully created!',
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
    <div className="p-4">
      <Card className="mx-auto w-full max-w-7xl p-4 px-4 py-5 sm:mt-10 sm:p-6 2xl:max-w-8xl">
        <CardHeader className="px-0 pt-2">
          <h1 className="text-3xl font-medium text-foreground underline">
            Add a new person
          </h1>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6 md:grid md:grid-cols-3 md:gap-6"
          >
            <div className="col-span-3 flex gap-6">
              <Avatar className="col-span-5 h-24 w-24">
                <AvatarImage
                  src={avatarUrl ?? '/no-profile-picture.svg'}
                  alt="Avatar image"
                />
                <AvatarFallback>TBA</AvatarFallback>
              </Avatar>
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
            </div>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
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
                  <FormLabel>Last name</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
                  <FormLabel>Phone number</FormLabel>
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
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
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
                  <FormLabel>Address</FormLabel>
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
                  <FormLabel>City</FormLabel>
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
                  <FormLabel>Post code</FormLabel>
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
                  <FormLabel>State</FormLabel>
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
                  <FormLabel>Country</FormLabel>
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
              className="col-span-3 justify-self-start"
              onClick={async () => await trpc.getAllUsers.invalidate()}
              disabled={addUserMutation.isLoading}
            >
              {addUserMutation.isLoading ? 'Ładowanie...' : 'Dodaj'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddPersonForm;
