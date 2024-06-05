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
  variant?: 'animals' | 'users' | 'joinRequests';
}

interface DataWithStatus {
  status: string;
}

function hasStatus<T extends object>(data: T): data is T & DataWithStatus {
  return data && typeof (data as T & DataWithStatus).status === 'string';
}

export function DataTableRowActions<TData extends object>({
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

  const rejectJoinRequestMutation = api.shelter.rejectJoinRequest.useMutation({
    onSuccess: async () => {
      toast({
        description: t('reject_join_request_toast_success'),
        variant: 'success',
      });
      await trpc.shelter.getJoinRequests.invalidate();
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const acceptJoinRequestMutation = api.shelter.acceptJoinRequest.useMutation({
    onSuccess: async () => {
      toast({
        description: t('accept_join_request_toast_success'),
        variant: 'success',
      });
      await trpc.shelter.getJoinRequests.invalidate();
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteJoinRequestMutation = api.shelter.deleteJoinRequest.useMutation({
    onSuccess: async () => {
      toast({
        description: t('delete_join_request_toast_success'),
        variant: 'success',
      });
      await trpc.shelter.getJoinRequests.invalidate();
      await trpc.user.getAllPeopleAssociatedWithShelter.invalidate();
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: 'destructive',
      });
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

  const acceptJoinRequest = async (joinRequest: TData) => {
    const parsedJoinRequest = idSchema.parse(joinRequest);
    await acceptJoinRequestMutation.mutateAsync({ id: parsedJoinRequest.id });
  };

  const deletePersonMutation = api.user.deletePersonById.useMutation({
    onSuccess: async () => {
      toast({
        description: t('delete_person_toast_success'),
        variant: 'success',
      });
      await trpc.user.getAllPeopleAssociatedWithShelter.invalidate();
      await trpc.shelter.getJoinRequests.invalidate();
    },
  });
  const trpc = api.useUtils();
  const router = useRouter();
  const { t } = useTranslation('common');

  const deletePet = async (animal: TData) => {
    const parsedAnimal = idSchema.parse(animal);
    await deletePetMutation.mutateAsync(parsedAnimal.id);
  };

  const deleteRequest = async (joinRequest: TData) => {
    const parsedJoinRequest = idSchema.parse(joinRequest);
    await deleteJoinRequestMutation.mutateAsync({ id: parsedJoinRequest.id });
  };

  const rejectRequest = async (joinRequest: TData) => {
    const parsedJoinRequest = idSchema.parse(joinRequest);
    await rejectJoinRequestMutation.mutateAsync({ id: parsedJoinRequest.id });
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
    deletePersonMutation.status === 'pending' ||
    deleteJoinRequestMutation.status === 'pending'
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
        {variant !== 'joinRequests' && (
          <DropdownMenuItem
            onClick={() =>
              variant === 'animals' ? goToPetProfile(data) : goToProfile(data)
            }
          >
            {t('animals_table_row_action_view_profile')}
          </DropdownMenuItem>
        )}
        {variant === 'joinRequests' &&
          hasStatus(data) &&
          data.status !== 'invited' && (
            <>
              <DropdownMenuItem onClick={() => acceptJoinRequest(data)}>
                {t('join_requests_table_row_action_accept')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => rejectRequest(data)}>
                {t('join_requests_table_row_action_reject')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
        {variant !== 'joinRequests' && (
          <DropdownMenuItem
            onClick={() =>
              variant === 'animals' ? deletePet(data) : deletePerson(data)
            }
          >
            {t('animals_table_row_action_delete')}
          </DropdownMenuItem>
        )}
        {variant === 'joinRequests' && (
          <DropdownMenuItem onClick={() => deleteRequest(data)}>
            {t('join_requests_table_row_action_delete')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
