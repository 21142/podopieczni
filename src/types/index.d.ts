import { type RouterOutputs } from '~/lib/api';

export type AnimalDto = RouterOutputs['pet']['getAllPetsDataForTable'][number];
export type UserDto =
  RouterOutputs['user']['getAllPeopleAssociatedWithShelter'][number];

export type RecentlyAddedAnimals =
  RouterOutputs['pet']['getPetsAddedInTheLastMonth'];

export type RecentlyAddedAnimal =
  RouterOutputs['pet']['getPetsAddedInTheLastMonth'][number];
