import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useToast } from '~/hooks/use-toast';
import {
  userEmailInviteSchema,
  type IUserInviteDetails,
} from '~/lib/validators/userValidation';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';

const EmailInviteForm = () => {
  const { toast } = useToast();

  const form = useForm<IUserInviteDetails>({
    resolver: zodResolver(userEmailInviteSchema),
  });

  const onSubmit = async (values: IUserInviteDetails) => {
    try {
      await signIn('email', {
        callbackUrl: '/',
        redirect: false,
        email: form.getValues('email'),
      });
      toast({
        description: `Invitation email successfully sent to ${values.email}!`,
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
    <div className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter email</FormLabel>
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
            size="sm"
            className="w-48 justify-self-start"
          >
            <Icons.mail className="mr-2 h-4 w-4" />
            Wyślij zaproszenie
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailInviteForm;
