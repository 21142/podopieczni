import { useRouter } from 'next/navigation';
import { Icons } from '../icons/Icons';
import { Label } from '../primitives/Label';
import { RadioGroup, RadioGroupItem } from '../primitives/RadioButton';

const SearchCategory = () => {
  const router = useRouter();
  return (
    <RadioGroup
      defaultValue="dog"
      className="grid grid-cols-3 gap-4 lg:col-start-2 lg:col-end-5"
    >
      <Label
        htmlFor="dog"
        className="[&:has([data-state=checked])]:border-primary flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xl hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
      >
        <RadioGroupItem
          value="dog"
          id="dog"
          className="sr-only"
        />
        <Icons.dog className="mb-3 h-14 w-14" />
        Dogs
      </Label>
      <Label
        htmlFor="cat"
        className="[&:has([data-state=checked])]:border-primary flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xl hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
      >
        <RadioGroupItem
          value="cat"
          id="cat"
          className="sr-only"
        />
        <Icons.cat className="mb-3 h-14 w-14" />
        Cats
      </Label>
      <Label
        htmlFor="shelter"
        className="[&:has([data-state=checked])]:border-primary flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xl hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
        onClick={() => router.push('/organizations')}
      >
        <RadioGroupItem
          value="shelter"
          id="shelter"
          className="sr-only"
        />
        <Icons.home className="mb-3 h-14 w-14" />
        Shelters
      </Label>
    </RadioGroup>
  );
};

export default SearchCategory;
