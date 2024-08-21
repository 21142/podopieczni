import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { links } from '~/config/siteConfig';
import { TypeOfResults, voivodships } from '~/lib/constants';
import {
  shelterFilterOptionsSchema,
  type IShelterFilterOptions,
} from '~/lib/validators/shelterValidation';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
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
  const { t } = useTranslation('common');
  const router = useRouter();
  const params = useSearchParams();

  const form = useForm<IShelterFilterOptions>({
    resolver: zodResolver(shelterFilterOptionsSchema),
  });

  const onSubmit = (values: IShelterFilterOptions) => {
    const filters: string[] = [];

    Object.entries(values).forEach(([, value]) => {
      if (value !== '' && value !== undefined) {
        filters.push(`${value}`);
      }
    });

    const searchQuery = filters.join('&');
    router.push(links.search(TypeOfResults.Organization, searchQuery));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        {params.has('search') && (
          <Button
            className="transition-all duration-300 ease-in-out"
            size="lg"
            onClick={() => {
              form.reset();
              router.push(links.results(TypeOfResults.Organization));
            }}
          >
            {t('reset_filters')}
          </Button>
        )}
        {form.formState.isDirty && (
          <Button
            type="submit"
            variant="primary"
            className="transition-all duration-300 ease-in-out"
            size="lg"
          >
            {t('search_new_results')}
          </Button>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('shelter_settings_form_label_name')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={t('shelter_filter_name_placeholder')}
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
                    placeholder={t('shelter_filter_address_placeholder')}
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
