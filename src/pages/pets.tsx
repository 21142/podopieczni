import { type ColumnDef } from '@tanstack/react-table';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { Icons } from '~/components/icons/Icons';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/primitives/Avatar';
import { Button } from '~/components/primitives/Button';
import { DataTable } from '~/components/primitives/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/primitives/DropdownMenu';
import Spinner from '~/components/spinners/Spinner';
import { api, type RouterOutputs } from '~/lib/api';

type AnimalDto = RouterOutputs['pet']['getAllPetsDataForTable'][number];

export const columns: ColumnDef<AnimalDto>[] = [
  {
    accessorKey: 'image',
    header: () => (
      <div className="flex items-center gap-1 text-left dark:text-neutral-100 dark:hover:text-neutral-100">
        Photo
      </div>
    ),
    cell: ({ row }) => (
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={row.getValue('image')}
          width={48}
          height={48}
          alt="animal profile picture"
        />
        <AvatarFallback>
          <Icons.dog className="h-6 w-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'species',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Species
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'breed',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Breed
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    header: () => (
      <div className="text-left dark:text-neutral-100 dark:hover:text-neutral-100">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const animal = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <Icons.more className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log('list for adoption', animal.id)}
            >
              List for adoption
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(animal.id)}
            >
              Copy animal ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('delete', animal.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Pets: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = api.pet.getAllPetsDataForTable.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex max-h-screen flex-col items-center justify-center">
        <div className="container">
          <Button
            onClick={() => void router.push('/animal/register')}
            variant="primary"
            className="mt-4"
          >
            Dodaj zwierzaka
          </Button>
          {data && (
            <DataTable
              columns={columns}
              data={data}
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Pets;
