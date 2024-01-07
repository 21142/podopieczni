/* eslint-disable no-unused-vars */
export default interface IAnimalData {
  id: number;
  organization_id: string;
  url: string;
  type: Species;
  breeds: IBreeds;
  colors: IColors;
  age: Age;
  gender: Gender;
  size: Size;
  coat?: string;
  attributes: IAttributes;
  environment: IEnvironment;
  tags: string[];
  name: string;
  description?: string | undefined;
  organization_animal_id?: string;
  photos: IPhoto[];
  videos: string[];
  status: string;
  status_changed_at: string;
  published_at: string;
  distance: number;
  contact: IContact;
}

export interface IEnvironment {
  children?: boolean;
  dogs?: boolean;
  cats?: boolean;
}

export interface IContact {
  email: string;
  phone: string;
  address: IAddress;
}

export interface IAddress {
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface IBreeds {
  primary: string;
  secondary?: string;
  mixed: boolean;
  unknown: boolean;
}

export interface IAttributes {
  spayed_neutered: boolean;
  house_trained: boolean;
  declawed?: boolean;
  special_needs: boolean;
  shots_current: boolean;
}

export interface IPhoto {
  small?: string;
  medium?: string;
  large?: string;
  full?: string;
}

export interface IColors {
  primary?: string;
  secondary?: string;
}

export interface IOrganizationData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
  hours: object;
  adoption: object;
  social_media: object;
  website?: string | null;
  mission_statement?: string | null;
  photos: IPhoto[];
  distance: number;
  status: string;
  description: string;
  organization_id: string;
  age: Age;
  breeds: IBreeds;
  type: Species;
}

export interface Address {
  address1: string;
  city: string;
  country: string;
  state: string;
}

export enum Species {
  Cat = 'Cat',
  Dog = 'Dog',
}

export enum Age {
  Adult = 'Adult',
  Baby = 'Baby',
  Senior = 'Senior',
}

export enum Gender {
  Female = 'Female',
  Male = 'Male',
}

export enum Size {
  Large = 'Large',
  Medium = 'Medium',
  Small = 'Small',
}
