import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { useToast } from '~/hooks/useToast';
import {
  userEmailSchema,
  type IUserEmail,
} from '~/lib/validators/userValidation';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';

const EmailInviteForm = () => {
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const form = useForm<IUserEmail>({
    resolver: zodResolver(userEmailSchema),
  });

  const onSubmit = async (values: IUserEmail) => {
    try {
      await signIn('email', {
        callbackUrl: '/',
        redirect: false,
        email: values.email,
      });
      toast({
        description: t('invite_user_form_toast_success', {
          email: values.email,
        }),
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
                <FormLabel>{t('invite_user_form_title')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t('invite_user_form_subtitle')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="sm"
            className="w-48 justify-self-start"
          >
            <Icons.mail className="mr-2 h-4 w-4" />
            {t('invite_user_form_button')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailInviteForm;
