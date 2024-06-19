import { Icons } from '~/components/icons/Icons';

//TODO: i18n
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

//TODO: i18n
export const statuses = [
  {
    value: 'adoptable',
    label: 'Adoptable',
  },
  {
    value: 'quarantined',
    label: 'Quarantined',
  },
  {
    value: 'adopted',
    label: 'Adopted',
  },
];

//TODO: i18n
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

//TODO: i18n
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

export const voivodships = [
  { name: 'Dolnośląskie' },
  { name: 'Małopolskie' },
  { name: 'Lubelskie' },
  { name: 'Lubuskie' },
  { name: 'Opolskie' },
  { name: 'Łódzkie' },
  { name: 'Mazowieckie' },
  { name: 'Wielkopolskie' },
  { name: 'Podkarpackie' },
  { name: 'Podlaskie' },
  { name: 'Pomorskie' },
  { name: 'Śląskie' },
  { name: 'Świętokrzyskie' },
  { name: 'Warmińsko-mazurskie' },
  { name: 'Kujawsko-pomorskie' },
  { name: 'Zachodniopomorskie' },
];
