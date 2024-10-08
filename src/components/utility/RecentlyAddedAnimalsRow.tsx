import { type FC } from 'react';
import { type RecentlyAddedAnimal } from '~/types';
import { Icons } from '../icons/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/Avatar';
import { Badge } from '../primitives/Badge';

type RecentlyAddedAnimalsRowProps = {
  animal: RecentlyAddedAnimal;
  className?: string;
  onClick?: () => void;
};

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
        {animal.image && (
          <AvatarImage
            src={animal.image}
            alt="Avatar"
          />
        )}
        <AvatarFallback>
          {animal.breed === 'dog' ? (
            <Icons.dog className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Icons.cat className="h-6 w-6 text-muted-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{animal.name}</p>
        <p className="text-sm text-muted-foreground">{animal.breed}</p>
      </div>
      <Badge
        variant="outline"
        className="ml-auto text-sm font-medium"
      >
        {animal.status}
      </Badge>
    </div>
  );
};

export default RecentlyAddedAnimalsRow;
