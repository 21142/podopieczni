import clsx from 'clsx';
import type { ComponentProps } from 'react';

const Button = ({
  children,
  className,
  ...props
}: ComponentProps<'button'>) => (
  <button
    {...props}
    className={clsx(
      'cursor-pointer rounded-full border border-primary-300 py-1 px-4 text-sm font-medium text-primary-300 transition-colors duration-200 ease-in-out hover:bg-primary-300 hover:text-white disabled:!bg-gray-300',
      className
    )}
  >
    {children}
  </button>
);

export default Button;
