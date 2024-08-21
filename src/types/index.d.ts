import { type RouterOutputs } from '~/lib/api';

export type Translations = {
  en: string;
  pl: string;
};

export type AnimalDto = RouterOutputs['pet']['getAllPetsDataForTable'][number];
export type UserDto =
  RouterOutputs['user']['getAllPeopleAssociatedWithShelter'][number];

export type JoinRequestDto =
  RouterOutputs['shelter']['getJoinRequests'][number];

export type AdoptionApplicationDto =
  RouterOutputs['adoptionApplication']['getAllForShelter'][number];

export type RecentlyAddedAnimals =
  RouterOutputs['pet']['getPetsAddedInTheLastMonth'];

export type RecentlyAddedAnimal =
  RouterOutputs['pet']['getPetsAddedInTheLastMonth'][number];

export type FeaturedPet = RouterOutputs['pet']['getFeaturedAnimals'][number];

export type PetAvailableForAdoption =
  RouterOutputs['pet']['queryPetsAvailableForAdoption']['pets'][number];

export type FavoritePet = RouterOutputs['user']['getFavoritePets'][number];

export type Shelter =
  RouterOutputs['shelter']['queryAvailableShelters']['shelters'][number];

export type ShelterDetails = RouterOutputs['shelter']['getShelterDetails'];

export type UserDetailsDto = RouterOutputs['user']['getUserById'];
