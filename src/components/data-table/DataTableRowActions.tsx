import { type Row } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const animal = row.original;
  const deletePetMutation = api.pet.deletePetById.useMutation();
  const trpc = api.useContext().pet;
  const router = useRouter();

  const deletePet = async (animal: TData) => {
    const parsedAnimal = petIdSchema.parse(animal);
    await deletePetMutation.mutateAsync(parsedAnimal.id);
    trpc.getAllPetsDataForTable.invalidate();
  };

  const goToProfile = (animal: TData) => {
    const parsedAnimal = petIdSchema.parse(animal);
    router.push(`/animal/${parsedAnimal.id}`);
  };

  if (deletePetMutation.status === 'loading') {
    return (
      <Icons.spinner className="ml-2 h-4 w-4 animate-spin text-primary-200" />
    );
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
        <DropdownMenuItem disabled>List for adoption</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => goToProfile(animal)}>
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Edit details</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deletePet(animal)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
