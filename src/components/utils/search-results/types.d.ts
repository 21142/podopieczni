/* eslint-disable no-unused-vars */
export default interface AnimalData {
  id: number;
  organization_id: string;
  url: string;
  type: Species;
  breeds: Breeds;
  colors: Colors;
  age: Age;
  gender: Gender;
  size: Size;
  coat?: string;
  attributes: Attributes;
  tags: string[];
  name: string;
  description?: string | undefined;
  organization_animal_id?: string;
  photos: Photo[];
  videos: any[];
  status: string;
  status_changed_at: string;
  published_at: string;
  distance: number;
}

export interface Breeds {
  primary: string;
  secondary?: string;
  mixed: boolean;
  unknown: boolean;
}

export interface Attributes {
  spayed_neutered: boolean;
  house_trained: boolean;
  declawed?: boolean;
  special_needs: boolean;
  shots_current: boolean;
}

export interface Photo {
  small?: string;
  medium?: string;
  large?: string;
  full?: string;
}

export interface Colors {
  primary?: string;
  secondary?: string;
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
