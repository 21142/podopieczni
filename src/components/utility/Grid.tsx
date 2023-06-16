import { type User } from '@prisma/client';
import { Roles } from '~/utils/constants';
import UserCard from '../cards/UserCard';

export interface IGrid {
  items: User[];
}

const Grid: React.FC<IGrid> = ({ items }) => {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-7xl gap-8 px-4 py-5 sm:p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:max-w-8xl">
      {items?.map((user: User) => (
        <UserCard
          key={user.id}
          id={user.id}
          image={user.image ?? '/no-profile-picture.svg'}
          name={
            user.name
              ? user.name ?? `${user.firstName} ${user.lastName}`
              : 'Anonimowy użytkownik'
          }
          role={user.role ?? Roles.Adopter}
        />
      ))}
    </div>
  );
};

export default Grid;
