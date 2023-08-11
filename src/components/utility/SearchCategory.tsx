import { useTranslation } from 'next-i18next';
import { Icons } from '../icons/Icons';
import { Label } from '../primitives/Label';
import { RadioGroup, RadioGroupItem } from '../primitives/RadioButton';

const SearchCategory = () => {
  const { t } = useTranslation('common');
  return (
    <RadioGroup
      defaultValue=""
      className="grid grid-cols-3 gap-4 text-muted-foreground lg:col-start-2 lg:col-end-5"
    >
      <Label
        htmlFor="dog"
        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xl transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary-300 [&:has([data-state=checked])]:text-primary-300"
      >
        <RadioGroupItem
          value="dog"
          id="dog"
          className="sr-only"
        />
        <Icons.dog className="mb-3 h-14 w-14" />
        {t('search_category_dogs')}
      </Label>
      <Label
        htmlFor="cat"
        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xl transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary-300 [&:has([data-state=checked])]:text-primary-300"
      >
        <RadioGroupItem
          value="cat"
          id="cat"
          className="sr-only"
        />
        <Icons.cat className="mb-3 h-14 w-14" />
        {t('search_category_cats')}
      </Label>
      <Label
        htmlFor="shelter"
        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xl transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary-300 [&:has([data-state=checked])]:text-primary-300"
        // onClick={() => router.push('/organizations')}
      >
        <RadioGroupItem
          value="shelter"
          id="shelter"
          className="sr-only"
        />
        <Icons.home className="mb-3 h-14 w-14" />
        {t('search_category_shelters')}
      </Label>
    </RadioGroup>
  );
};

export default SearchCategory;
