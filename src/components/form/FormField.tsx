import type { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

export interface UseFormFieldProps extends PropsWithChildren {
  name: string;
  label: string;
}

export const useFormField = <P extends UseFormFieldProps>(props: P) => {
  const { label, name, ...otherProps } = props;
  const id = name;

  return {
    formFieldProps: { id, name, label },
    childProps: { ...otherProps, id, name },
  };
};

interface Props extends UseFormFieldProps {
  id: string;
}

const FormField = ({ children, name, id, label }: Props) => {
  const form = useFormContext();
  const state = form.getFieldState(name, form.formState);

  return (
    <div className="relative z-0 min-w-[16rem]">
      <label
        htmlFor={id}
        className="align-center placeholder-opacity-20:text-primary-400 absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light tracking-[0.25rem] text-primary-400 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80"
      >
        {label.toUpperCase()}
      </label>
      {children}
      {state.error && (
        <p className="mt-2 text-sm text-red-600">{state.error.message}</p>
      )}
    </div>
  );
};

export default FormField;
