import { type RouterOutputs } from '~/lib/api';

export type AnimalDto = RouterOutputs['pet']['getAllPetsDataForTable'][number];
export type UserDto =
  RouterOutputs['user']['getAllPeopleAssociatedWithShelter'][number];

export type RecentlyAddedAnimals =
  RouterOutputs['pet']['getPetsAddedInTheLastMonth'];

export type RecentlyAddedAnimal =
  RouterOutputs['pet']['getPetsAddedInTheLastMonth'][number];

export type FeaturedPet = RouterOutputs['pet']['getFeaturedAnimals'][number];

export type PetAvailableForAdoption =
  RouterOutputs['pet']['queryPetsAvailableForAdoptionFulltextSearch'][number];

export type Shelter =
  RouterOutputs['shelter']['querySheltersFulltextSearch'][number];
