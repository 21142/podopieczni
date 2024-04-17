import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { type RecentlyAddedAnimals } from '~/types';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import RecentlyAddedAnimalsRow from './RecentlyAddedAnimalsRow';

interface RecentAdoptionsProps {
  animals?: RecentlyAddedAnimals;
}

const RecentAdoptions: FC<RecentAdoptionsProps> = ({ animals }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      {animals ? (
        animals.map((animal) => (
          <RecentlyAddedAnimalsRow
            key={animal.id}
            animal={animal}
            className="h-16 cursor-pointer pr-3 hover:bg-card"
            onClick={() => void router.push(links.animal(animal.id))}
          />
        ))
      ) : (
        <>
          <Icons.crossedCircle className="my-9 h-24 w-24 text-muted-foreground transition-colors hover:text-muted-foreground/80" />
          <span className="text-md font-light">
            Brak przyjętych w ostatnim miesiącu zwierzaków
          </span>
          <Button
            onClick={() => void router.push(links.registerAnimal)}
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
