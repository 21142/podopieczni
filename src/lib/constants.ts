import { Icons } from '~/components/icons/Icons';

export enum Roles {
  Adopter = 'Adopter',
  Shelter = 'Shelter',
  Admin = 'Admin',
}

export enum TypeOfResults {
  Animal = 'pets',
  Organization = 'organizations',
}

export enum Variant {
  Animal = 'pet',
  Organization = 'organization',
}

export const statuses = [
  {
    value: 'adoptable',
    label: 'Adoptable',
  },
  {
    value: 'quarantined',
    label: 'Quarantined',
  },
];

export const species = [
  {
    value: 'dog',
    label: 'Dog',
    icon: Icons.dog,
  },
  {
    value: 'cat',
    label: 'Cat',
    icon: Icons.cat,
  },
];

export const roles = [
  {
    value: 'Adopter',
    label: 'Adopter',
  },
  {
    value: 'Shelter',
    label: 'Shelter',
  },
  {
    value: 'Admin',
    label: 'Admin',
  },
];
