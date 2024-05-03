import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // browser should use relative url
    return '';
  }
  const protocol = process.env.VERCEL_URL ? 'https://' : 'http://';
  const hostname =
    process.env.VERCEL_URL ?? `localhost:${process.env.PORT ?? 3000}`;

  return `${protocol}${hostname}`;
}

export function mapIntakeEventDate(value: string) {
  if (value) {
    const inputDate = new Date(value);

    if (!isNaN(inputDate.getTime())) {
      return inputDate.toISOString();
    } else {
      console.error('Invalid mapping date string:', value);
    }
  }

  return undefined;
}

export function getDocumentType(url: string): string {
  const fileExtension = url.split('.').pop();

  if (!fileExtension) {
    return 'unknown';
  }

  return fileExtension;
}

export function calculatePetAgeGroup(dateOfBirth: Date): string {
  const currentDate = new Date();
  const dob = new Date(dateOfBirth);
  const ageInMilliseconds = currentDate.getTime() - dob.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);

  if (ageInYears < 1) {
    return 'Puppy';
  } else if (ageInYears < 3) {
    return 'Young';
  } else if (ageInYears < 7) {
    return 'Adult';
  } else {
    return 'Senior';
  }
}

export function calculatePetSizeGroup(weight: number): string {
  if (weight == 0) {
    return 'Unknown';
  } else if (weight < 11) {
    return 'Small';
  } else if (weight < 27) {
    return 'Medium';
  } else if (weight < 45) {
    return 'Large';
  } else {
    return 'Extra Large';
  }
}
