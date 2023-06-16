import { forwardRef } from 'react';
import Root, { type Props as RootProps } from '../inputs/Input';
import FormField, { useFormField, type UseFormFieldProps } from './FormField';

interface Props extends UseFormFieldProps, RootProps {
  name: string;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
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

export default Input;

Input.displayName = 'FormInput';
