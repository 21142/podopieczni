import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { type RecentlyAddedAnimals } from '~/types';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import Spinner from '../spinner/Spinner';
import RecentlyAddedAnimalsRow from './RecentlyAddedAnimalsRow';

type RecentAdoptionsProps = {
  animals?: RecentlyAddedAnimals;
  isLoading?: boolean;
};

const RecentAdoptions: FC<RecentAdoptionsProps> = ({ animals, isLoading }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  if (isLoading) {
    return (
      <div className="px-12 py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="ml-1 flex flex-col">
      {animals && animals.length > 0 ? (
        animals.map((animal) => (
          <RecentlyAddedAnimalsRow
            key={animal.id}
            animal={animal}
            className="h-16 cursor-pointer px-6 hover:bg-card"
            onClick={() => router.push(links.animal(animal.id))}
          />
        ))
      ) : (
        <div className="p-4">
          <Icons.crossedCircle className="my-9 h-24 w-24 text-muted-foreground transition-colors hover:text-muted-foreground/80" />
          <p className="text-md font-light">
            {t('recent_adoptions_no_animals')}
          </p>
          <Button
            onClick={() => router.push(links.registerAnimal)}
            size="lg"
            variant="primary"
            className="my-4"
          >
            {t('add_pet_form_title')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentAdoptions;
