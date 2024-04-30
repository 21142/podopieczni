import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { species } from '~/static/species';
import { Icons } from '../icons/Icons';
import { Label } from '../primitives/Label';
import { RadioGroup, RadioGroupItem } from '../primitives/RadioButton';

type Category = 'dog' | 'cat' | 'shelter';

const SearchCategory = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const categoryMappings: Record<Category, string> = useMemo(() => {
    return {
      dog: 'pies',
      cat: 'kot',
      shelter: 'schroniska',
    };
  }, []);

  useEffect(() => {
    const currentPath = router.asPath;
    if (currentPath.includes(`${categoryMappings['dog']}`)) {
      setSelectedCategory('dog');
    } else if (currentPath.includes(`${categoryMappings['cat']}`)) {
      setSelectedCategory('cat');
    } else if (currentPath.includes('organizations')) {
      setSelectedCategory('shelter');
    }
  }, [router.asPath, categoryMappings]);

  const handleCategorySelection = (category: Category) => {
    setSelectedCategory(category);
    if (category === 'shelter') {
      router.push('/organizations');
    } else {
      router.push(`/pets?search=${categoryMappings[category]}`);
    }
  };

  return (
    <RadioGroup
      defaultValue=""
      value={selectedCategory}
      className="grid grid-cols-3 gap-4 text-muted-foreground lg:col-start-2 lg:col-end-5"
    >
      {species.map((specie) => (
        <Label
          key={specie.en}
          htmlFor={specie.en.toLowerCase()}
          className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-base transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground sm:text-xl ${
            selectedCategory === specie.en.toLowerCase() &&
            'border-primary-300 text-primary-300'
          }`}
          onClick={() =>
            handleCategorySelection(specie.en.toLowerCase() as Category)
          }
        >
          <RadioGroupItem
            value={specie.en.toLowerCase()}
            id={specie.en.toLowerCase()}
            className="sr-only"
          />
          <Icons.dog className="mb-3 h-14 w-14" />
          {specie[i18n.language as 'en' | 'pl']}
        </Label>
      ))}
      <Label
        htmlFor="shelter"
        className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-base transition-all hover:cursor-pointer hover:bg-accent hover:text-accent-foreground sm:text-xl ${
          selectedCategory === 'shelter' &&
          'border-primary-300 text-primary-300'
        }`}
        onClick={() => handleCategorySelection('shelter')}
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
