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
    value: 'Do adopcji',
    label: 'Do adopcji',
  },
  {
    value: 'Zaadoptowany',
    label: 'Zaadoptowany',
  },
];

//TODO: i18n
export const species = [
  {
    value: 'Pies',
    label: 'Pies',
    icon: Icons.dog,
  },
  {
    value: 'Kot',
    label: 'Kot',
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
