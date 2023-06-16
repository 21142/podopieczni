import type * as z from 'zod';
import { api } from '~/lib/api';
import { useToast } from '~/lib/use-toast';
import { useZodForm } from '~/lib/use-zod-form';
import { userAccountDetailsSchema } from '~/utils/validators/userValidation';
import { CvaButton } from '../buttons/cva/ButtonCva';
import Form from './Form';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

export const RolesMap: Record<
  z.infer<typeof userAccountDetailsSchema>['role'],
  string
> = {
  Adopter: 'Adopter',
  Shelter: 'Shelter',
  Admin: 'Admin',
};

const UserForm = () => {
  const trpc = api.useContext().user;
  const { toast } = useToast();

  const addNewUserMutation = api.user.add.useMutation({
    onSuccess: async () => {
      await trpc.getAllUsers.invalidate();
    },
  });

  const form = useZodForm({
    schema: userAccountDetailsSchema,
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-7xl px-4 py-5 sm:p-6 2xl:max-w-8xl">
      <Form
        form={form}
        onSubmit={async (data) => {
          await addNewUserMutation.mutateAsync(data);
          toast({
            description: 'Form successfully submitted!',
            variant: 'success',
          });
          form.reset();
        }}
      >
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <p className="mb-4 text-2xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
              Dodaj nową osobę
            </p>

            <div className="grid gap-8 md:grid-cols-3 md:gap-6">
              <FormInput
                type="text"
                label="first name"
                {...form.register('firstName')}
              />
              <FormInput
                type="text"
                label="last name"
                {...form.register('lastName')}
              />
              <FormInput
                type="email"
                label="email"
                {...form.register('email')}
              />
              <FormInput
                type="date"
                label="date of birth"
                {...form.register('dateOfBirth')}
              />
              <FormInput
                type="text"
                label="phone number"
                {...form.register('phoneNumber')}
              />
              <FormInput
                type="text"
                label="address"
                {...form.register('address')}
              />
              <FormInput
                type="text"
                label="city"
                {...form.register('city')}
              />
              <FormInput
                type="text"
                label="post code"
                {...form.register('postCode')}
              />
              <FormInput
                type="text"
                label="state"
                {...form.register('state')}
              />
              <FormInput
                type="text"
                label="country"
                {...form.register('country')}
              />
              <FormSelect
                label="role"
                {...form.register('role')}
              >
                {userAccountDetailsSchema.shape.role.options.map((op) => (
                  <option
                    key={op.value}
                    value={op.value}
                  >
                    {RolesMap[op.value]}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="mt-12 bg-neutral-0 text-left">
              <CvaButton
                variant="primary"
                className="w-42 rounded-md"
                onClick={async () => await trpc.getAllUsers.invalidate()}
                disabled={addNewUserMutation.isLoading}
                type="submit"
              >
                {addNewUserMutation.isLoading ? 'Ładowanie...' : 'Zapisz'}
              </CvaButton>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
