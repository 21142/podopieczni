import { type z } from 'zod';
import { type outcomeEvent } from '~/lib/validators/petValidation';
import { type Translations } from '~/types';

export const OutcomeEventTypeMap: Record<
  z.infer<typeof outcomeEvent>['eventType'],
  Translations
> = {
  ADOPTION: {
    en: 'Adoption',
    pl: 'Adopcja',
  },
  TRANSFER: {
    en: 'Transfer',
    pl: 'Przekazanie',
  },
  EUTHANIZED: {
    en: 'Euthanized',
    pl: 'Eutanazja',
  },
  DIED: {
    en: 'Died',
    pl: 'Zmarł',
  },
  RETURN: {
    en: 'Return to Owner',
    pl: 'Powrót do właściciela',
  },
};
