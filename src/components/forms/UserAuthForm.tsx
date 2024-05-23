import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { type HTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '~/lib/utils';
import {
  userEmailSchema,
  type IUserEmail,
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

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
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

      await signIn('email', {
        email: values.email,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div
      className={cn('grid gap-6', className)}
      {...props}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="example@gmail.com"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              {form.formState.isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t('signin_button')}
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('signin_or')}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        size="lg"
        disabled={form.formState.isSubmitting}
        onClick={() => signIn('google')}
      >
        {form.formState.isSubmitting ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
