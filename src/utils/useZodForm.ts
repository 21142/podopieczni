import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormProps } from 'react-hook-form';
import { z } from 'zod';

interface UseZodFormProps<S extends z.ZodSchema>
  extends Exclude<UseFormProps<z.infer<S>>, 'resolver'> {
  schema: S;
}

export const useZodForm = <S extends z.ZodSchema>({
  schema,
  ...formProps
}: UseZodFormProps<S>) =>
  useForm({
    ...formProps,
    resolver: zodResolver(schema),
  });
