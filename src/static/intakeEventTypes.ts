import { type z } from 'zod';
import { type petDetailsSchema } from '~/lib/validators/petValidation';
import { type Translations } from '~/types';

export const IntakeEventTypeMap: Record<
  z.infer<typeof petDetailsSchema>['intakeEventType'],
  Translations
> = {
  STRAY: {
    en: 'Stray',
    pl: 'Zagubiony',
  },
  TRANSFER: {
    en: 'Transfer',
    pl: 'Przekazanie',
  },
  SURRENDER: {
    en: 'Surrender',
    pl: 'Oddanie',
  },
  BORN: {
    en: 'Born',
    pl: 'Urodzony',
  },
  RETURN: {
    en: 'Return',
    pl: 'Powrót',
  },
  UNKNOWN: {
    en: 'Unknown',
    pl: 'Nieznany',
  },
};
