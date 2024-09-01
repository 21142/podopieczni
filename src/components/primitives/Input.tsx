import { cva, type VariantProps } from 'cva';
import * as React from 'react';

import { cn } from '~/lib/utils';

const inputVariants = cva(
  'flex h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
  {
    variants: {
      variant: {
        default: 'border border-input rounded-md',
        primary: ['border-b-2 border-input rounded-sm'],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
