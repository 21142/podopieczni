import { forwardRef } from 'react';
import Root, { type SelectProps as RootProps } from '../inputs/select/Select';
import FormField, { useFormField, type UseFormFieldProps } from './FormField';

interface Props extends UseFormFieldProps, RootProps {
  name: string;
}

const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const { formFieldProps, childProps } = useFormField(props);

  return (
    <FormField {...formFieldProps}>
      <Root
        {...childProps}
        ref={ref}
      />
    </FormField>
  );
});

export default Select;
