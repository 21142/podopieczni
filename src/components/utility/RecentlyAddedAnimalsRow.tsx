import { type FC } from 'react';
import { type RecentlyAddedAnimal } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/Avatar';

interface RecentlyAddedAnimalsRowProps {
  animal: RecentlyAddedAnimal;
  className?: string;
  onClick?: () => void;
}

const RecentlyAddedAnimalsRow: FC<RecentlyAddedAnimalsRowProps> = ({
  animal,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center ${className}`}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={animal.image ?? '/no-profile-picture.svg'}
          alt="Avatar"
        />
        <AvatarFallback>TBA</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{animal.name}</p>
        <p className="text-sm text-muted-foreground">{animal.breed}</p>
      </div>
      <div className="ml-auto font-medium">
        {animal.status === 'adoptable' ? 'czeka na nowy dom' : ''}
      </div>
    </div>
  );
};

export default RecentlyAddedAnimalsRow;
