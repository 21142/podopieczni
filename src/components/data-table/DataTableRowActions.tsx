import { type Row } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import { idSchema } from '~/lib/validators/petValidation';
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
  variant?: 'animals' | 'users';
}

export function DataTableRowActions<TData>({
  row,
  variant,
}: DataTableRowActionsProps<TData>) {
  const data = row.original;
  const { toast } = useToast();
  const deletePetMutation = api.pet.deletePetById.useMutation({
    onSuccess: async () => {
      toast({
        description: t('delete_pet_toast_success'),
        variant: 'success',
      });
      await trpc.pet.getAllPetsDataForTable.invalidate();
    },
  });
  const markAvailableForAdoptionMutation =
    api.pet.markAvailableForAdoption.useMutation({
      onSuccess: async (data) => {
        if (data.success) {
          toast({
            description: t('list_pet_for_adoption_toast_success'),
            variant: 'success',
          });
          await trpc.pet.getAllPetsDataForTable.invalidate();
        } else {
          toast({
            description: data.message,
            variant: 'destructive',
          });
        }
      },
    });
  const deletePersonMutation = api.user.deletePersonById.useMutation({
    onSuccess: async () => {
      toast({
        description: t('delete_person_toast_success'),
        variant: 'success',
      });
      await trpc.user.getAllPeopleAssociatedWithShelter.invalidate();
    },
  });
  const trpc = api.useUtils();
  const router = useRouter();
  const { t } = useTranslation('common');

  const deletePet = async (animal: TData) => {
    const parsedAnimal = idSchema.parse(animal);
    await deletePetMutation.mutateAsync(parsedAnimal.id);
  };

  const goToPetProfile = (animal: TData) => {
    const parsedAnimal = idSchema.parse(animal);
    router.push(links.animal(parsedAnimal.id));
  };

  const markAvailableForAdoption = async (animal: TData) => {
    const parsedAnimal = idSchema.parse(animal);
    await markAvailableForAdoptionMutation.mutateAsync(parsedAnimal.id);
  };

  const goToProfile = (person: TData) => {
    const parsedPerson = idSchema.parse(person);
    router.push(links.person(parsedPerson.id));
  };

  const deletePerson = async (person: TData) => {
    const parsedPerson = idSchema.parse(person);
    await deletePersonMutation.mutateAsync(parsedPerson.id);
  };

  if (
    deletePetMutation.status === 'pending' ||
    deletePersonMutation.status === 'pending'
  ) {
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
        {variant === 'animals' && (
          <>
            <DropdownMenuItem onClick={() => markAvailableForAdoption(data)}>
              {t('animals_table_row_action_list_for_adoption')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() =>
            variant === 'animals' ? goToPetProfile(data) : goToProfile(data)
          }
        >
          {t('animals_table_row_action_view_profile')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            variant === 'animals' ? deletePet(data) : deletePerson(data)
          }
        >
          {t('animals_table_row_action_delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
