import { cva, type VariantProps } from 'cva';
import * as React from 'react';

import { cn } from '~/lib/utils';
import { Icons } from '../icons/Icons';

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 disabled:opacity-50 dark:focus:ring-neutral-400 disabled:pointer-events-none dark:focus:ring-offset-neutral-900 data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-50 dark:text-neutral-900',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        success:
          'bg-green-400 text-white hover:bg-green-500 dark:hover:bg-green-500',
        outline:
          'bg-transparent border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100',
        combobox:
          'bg-transparent dark:hover:bg-transparent hover:bg-transparent border-b-2 rounded-md border-neutral-200 dark:border-neutral-700 dark:text-neutral-100 shadow-sm',
        subtle:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100',
        ghost:
          'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-100 dark:hover:text-neutral-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-neutral-900 dark:text-neutral-100 hover:bg-transparent dark:hover:bg-transparent',
        roundedButton:
          'cursor-pointer rounded-full border border-primary-300 dark:border-none text-primary-300 transition-colors duration-200 ease-in-out hover:bg-primary-300 hover:text-neutral-50 dark:bg-primary-300 dark:text-neutral-50 dark:hover:bg-primary-300/50',
        primaryLink:
          'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-primary-400 dark:text-primary-100 hover:text-primary-200 dark:hover:text-primary-200 hover:bg-transparent dark:hover:bg-transparent transition-colors',
        primary:
          'bg-primary-300 text-background dark:text-white dark:hover:bg-primary-400/80 hover:bg-primary-400/80',
        secondary:
          'bg-transparent marker:text-neutral-400 border-toned/10 border hover:border-toned/10 hover:bg-toned/10 hover:text-neutral-500',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, size, isLoading, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
