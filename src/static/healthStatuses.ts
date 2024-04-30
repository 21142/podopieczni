import { type z } from 'zod';
import { type petDetailsSchema } from '~/lib/validators/petValidation';
import { type Translations } from '~/types';

export const HealthStatusMap: Record<
  z.infer<typeof petDetailsSchema>['healthStatus'],
  Translations
> = {
  HEALTHY: {
    en: 'Healthy',
    pl: 'Zdrowy',
  },
  INJURED: {
    en: 'Injured',
    pl: 'Ranny',
  },
  SICK: {
    en: 'Sick',
    pl: 'Chory',
  },
  TREATED: {
    en: 'Treated',
    pl: 'Leczony',
  },
  QUARANTINE: {
    en: 'Quarantine',
    pl: 'Kwarantanna',
  },
  DEAD: {
    en: 'Dead',
    pl: 'Martwy',
  },
  UNKNOWN: {
    en: 'Unknown',
    pl: 'Nieznany',
  },
};
