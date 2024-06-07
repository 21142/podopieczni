import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { type RecentlyAddedAnimals } from '~/types';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import RecentlyAddedAnimalsRow from './RecentlyAddedAnimalsRow';

type RecentAdoptionsProps = {
  animals?: RecentlyAddedAnimals;
};

const RecentAdoptions: FC<RecentAdoptionsProps> = ({ animals }) => {
  const router = useRouter();

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
        <>
          <Icons.crossedCircle className="my-9 h-24 w-24 text-muted-foreground transition-colors hover:text-muted-foreground/80" />
          <span className="text-md font-light">
            Brak przyjętych w ostatnim miesiącu zwierzaków
          </span>
          <Button
            onClick={() => router.push(links.registerAnimal)}
            size="lg"
            variant="primary"
            className="my-4"
          >
            Dodaj zwierzaka
          </Button>
        </>
      )}
    </div>
  );
};

export default RecentAdoptions;
