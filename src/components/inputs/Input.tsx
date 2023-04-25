import { forwardRef, type ComponentProps } from 'react';

export interface Props extends ComponentProps<'input'> {}

const Input = forwardRef<HTMLInputElement, Props>(({ id, ...props }, ref) => (
  <input
    {...props}
    id={id}
    ref={ref}
    placeholder=" "
    className="autofill:border-blue peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm"
  />
));

export default Input;
