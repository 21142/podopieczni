import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { useToast } from '~/hooks/useToast';
import { voivodships } from '~/lib/constants';
import {
  shelterFilterOptionsSchema,
  type IShelterFilterOptions,
} from '~/lib/validators/petValidation';
import { Icons } from '../icons/Icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/Select';

const FilterSheltersResults = () => {
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const form = useForm<IShelterFilterOptions>({
    resolver: zodResolver(shelterFilterOptionsSchema),
  });

  const onSubmit = (values: IShelterFilterOptions) => {
    console.log(values);
    toast({
      description: `Loading new results...`,
      variant: 'success',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Search by name..."
                    {...field}
                  />
                  <Icons.search className="absolute right-2 top-2 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('form_label_address')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Search by address..."
                    {...field}
                  />
                  <Icons.search className="absolute right-2 top-2 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('filter_results_form_label_voivodship')}</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'filter_results_form_placeholder_voivodship'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {voivodships.map((voivodship) => (
                    <SelectItem
                      key={voivodship.name}
                      value={voivodship.name}
                    >
                      {voivodship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default FilterSheltersResults;
