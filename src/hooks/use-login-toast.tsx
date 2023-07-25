import Link from 'next/link';
import { buttonVariants } from '~/components/primitives/Button';
import { toast } from '~/hooks/use-toast';

export const useLoginToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'You are not authenticated',
      description: 'Please login to proceed.',
      variant: 'destructive',
      action: (
        <Link
          href="/api/auth/signin"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: 'outline' })}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
