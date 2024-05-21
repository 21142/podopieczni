import Link from 'next/link';
import { buttonVariants } from '~/components/primitives/Button';
import { links } from '~/config/siteConfig';
import { toast } from '~/hooks/useToast';

export const useLoginToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'You are not authenticated',
      description: 'Please login to proceed.',
      variant: 'destructive',
      action: (
        <Link
          href={links.signInAPI}
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
