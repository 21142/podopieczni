import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';
import { cn } from '~/lib/utils';
import {
  petFilterOptionsSchema,
  type IPetFilterOptions,
} from '~/lib/validators/petValidation';
import { catBreeds, dogBreeds } from '~/static/breeds';
import { coats } from '~/static/coats';
import { colors } from '~/static/colors';
import { genders } from '~/static/genders';
import { species } from '~/static/species';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../primitives/Command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/Popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/Select';

const FilterPetsResultsForm = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const {
    data: sheltersNames,
    isLoading,
    isError,
  } = api.shelter.getSheltersNames.useQuery();

  const form = useForm<IPetFilterOptions>({
    resolver: async (data, context, options) => {
      // debug zod validation schema
      console.log('formData', data);
      console.log(
        'zod validation result',
        await zodResolver(petFilterOptionsSchema)(data, context, options)
      );
      return zodResolver(petFilterOptionsSchema)(data, context, options);
    },
    defaultValues: {
      healthStatus: undefined,
    },
  });

  const onSubmit = (values: IPetFilterOptions) => {
    const filters: string[] = [];

    Object.entries(values).forEach(([name, value]) => {
      if (value !== '' && value !== undefined) {
        filters.push(`${name}=${value}`);
      }
    });

    const searchQuery = filters.join('&');
    router.push(links.search(TypeOfResults.Animal, searchQuery));
    toast({
      description: `Loading new results...`,
      variant: 'success',
    });
  };

  const breedsToDisplay =
    form.watch('species') == 'Cat' || form.watch('species') == 'Kot'
      ? catBreeds
      : dogBreeds;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        {form.formState.isDirty && (
          <Button
            type="submit"
            variant="primary"
            className="transition-all duration-300 ease-in-out"
            size="lg"
          >
            Search new results
          </Button>
        )}
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
          name="distance"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Distance</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Define distance... (in km)"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shelter"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Shelter</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="combobox"
                      role="combobox"
                      className={'w-full justify-between'}
                    >
                      {field.value
                        ? field.value
                        : t('add_pet_form_placeholder_shelter')}{' '}
                      <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  {isLoading && <div>Loading...</div>}
                  {isError && <div>Error fetching shelters names.</div>}
                  {sheltersNames?.length === 0 && <div>No shelters found.</div>}
                  {sheltersNames && (
                    <Command>
                      <CommandInput
                        placeholder={t('add_pet_form_placeholder_shelter')}
                      />
                      <CommandEmpty>No shelters found.</CommandEmpty>
                      <CommandGroup>
                        {sheltersNames.map((shelterName) => (
                          <CommandItem
                            value={shelterName.name}
                            key={shelterName.name}
                            onSelect={() => {
                              form.trigger('shelter');
                              form.setValue('shelter', shelterName.name);
                            }}
                          >
                            <Icons.check
                              className={cn(
                                'mr-2 h-4 w-4',
                                shelterName.name == field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {shelterName.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  )}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Age</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="puppy">Puppy</SelectItem>
                  <SelectItem value="young">Young</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Size</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extralarge">Extra large</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('add_pet_form_label_species')}</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('add_pet_form_placeholder_species')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {species.map((specie) => (
                    <SelectItem
                      key={specie[i18n.language as 'en' | 'pl']}
                      value={specie[i18n.language as 'en' | 'pl']}
                    >
                      {specie[i18n.language as 'en' | 'pl']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('add_pet_form_label_breed')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="combobox"
                      role="combobox"
                      className={'w-full justify-between'}
                    >
                      {field.value
                        ? breedsToDisplay.find(
                            (breed) =>
                              breed.pl === field.value ||
                              breed.en === field.value
                          )?.[i18n.language as 'en' | 'pl'] ??
                          t('add_pet_form_placeholder_breed')
                        : t('add_pet_form_placeholder_breed')}
                      <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder={t('add_pet_form_placeholder_breed')}
                    />
                    <CommandEmpty>No breeds found.</CommandEmpty>
                    <CommandGroup>
                      {breedsToDisplay.map((breed) => (
                        <CommandItem
                          value={breed[i18n.language as 'en' | 'pl']}
                          key={breed[i18n.language as 'en' | 'pl']}
                          onSelect={() => {
                            form.setValue(
                              'breed',
                              breed[i18n.language as 'en' | 'pl']
                            );
                          }}
                        >
                          <Icons.check
                            className={cn(
                              'mr-2 h-4 w-4',
                              breed.en == field.value || breed.pl == field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {breed[i18n.language as 'en' | 'pl']}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('add_pet_form_label_gender')}</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('add_pet_form_placeholder_gender')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genders.map((option) => (
                    <SelectItem
                      key={option[i18n.language as 'en' | 'pl']}
                      value={option[i18n.language as 'en' | 'pl']}
                    >
                      {option[i18n.language as 'en' | 'pl']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coat"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('add_pet_form_label_coat')}</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('add_pet_form_placeholder_coat')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coats.map((coat) => (
                    <SelectItem
                      key={coat[i18n.language as 'en' | 'pl']}
                      value={coat[i18n.language as 'en' | 'pl']}
                    >
                      {coat[i18n.language as 'en' | 'pl']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>{t('add_pet_form_label_color')}</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('add_pet_form_placeholder_color')}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem
                      key={color[i18n.language as 'en' | 'pl']}
                      value={color[i18n.language as 'en' | 'pl']}
                    >
                      {color[i18n.language as 'en' | 'pl']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="characteristics"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Characteristics</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select characteristics" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="houseTrained">House trained</SelectItem>
                  <SelectItem value="specialNeeds">Special Needs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goodWith"
          render={({ field }) => (
            <FormItem className="col-span-6 sm:col-span-3">
              <FormLabel>Good with</FormLabel>
              <Select
                onValueChange={field.onChange as (value: string) => void}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dogs">Dogs</SelectItem>
                  <SelectItem value="cats">Cats</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
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

export default FilterPetsResultsForm;
