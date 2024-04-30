import { forwardRef, type ComponentProps } from 'react';

export type Props = ComponentProps<'input'>;

const Input = forwardRef<HTMLInputElement, Props>(({ id, ...props }, ref) => (
  <input
    {...props}
    id={id}
    ref={ref}
    placeholder=" "
    className="peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pb-0 pt-5 text-neutral-800 outline-none duration-200 ease-out autofill:border-primary-300 focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
  />
));

export default Input;

Input.displayName = 'Input';
