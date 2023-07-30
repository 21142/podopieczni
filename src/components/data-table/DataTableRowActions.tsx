import { type Row } from '@tanstack/react-table';
import { api } from '~/lib/api';
import { petIdSchema } from '~/lib/validators/petValidation';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/DropdownMenu';
import Spinner from '../spinners/Spinner';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const animal = row.original;
  const deletePetMutation = api.pet.deletePetById.useMutation();
  const trpc = api.useContext().pet;

  const deletePet = async (animal: TData) => {
    const parsedAnimal = petIdSchema.parse(animal);
    await deletePetMutation.mutateAsync(parsedAnimal.id);
    trpc.getAllPetsDataForTable.invalidate();
  };

  if (deletePetMutation.status === 'loading') {
    return <Spinner small />;
  }

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
          onClick={() => console.log('list for adoption', animal)}
        >
          List for adoption
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Edit details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deletePet(animal)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
