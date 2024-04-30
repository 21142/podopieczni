import { type z } from 'zod';
import { type medicalEvent } from '~/lib/validators/petValidation';
import { type Translations } from '~/types';

export const MedicalEventTypeMap: Record<
  z.infer<typeof medicalEvent>['medicalEventType'],
  Translations
> = {
  VACCINATION: {
    en: 'Vaccination',
    pl: 'Szczepienie',
  },
  TREATMENT: {
    en: 'Treatment',
    pl: 'Leczenie',
  },
  DIAGNOSIS: {
    en: 'Diagnosis',
    pl: 'Diagnoza',
  },
  MEDICATION: {
    en: 'Medication',
    pl: 'Kurcja lekami',
  },
  SURGERY: {
    en: 'Surgery',
    pl: 'Operacja',
  },
};
