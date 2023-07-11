import { forwardRef, type ComponentProps } from 'react';

export type SelectProps = ComponentProps<'select'>

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => (
  <select
    {...props}
    className="mt-1 block w-full rounded-md border border-neutral-50 bg-white py-2 px-3 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-primary-400 sm:text-sm"
    ref={ref}
  />
));

export default Select;

Select.displayName = "Select"