import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, type z } from 'zod';
import {
  HealthStatusMap,
  IntakeEventTypeMap,
} from '~/components/forms/AddPetForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/primitives/Avatar';
import { Button, buttonVariants } from '~/components/primitives/Button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/primitives/Form';
import { Input } from '~/components/primitives/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/primitives/Select';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/lib/api';
import { UploadButton } from '~/lib/uploadthing';
import { cn, getDocumentType, mapIntakeEventDate } from '~/lib/utils';
import {
  document,
  fullPetDetailsSchema,
  medicalEvent,
  note,
  outcomeEvent,
  photo,
  type IDocument,
  type INote,
  type IPetFullDetails,
  type IPetMedicalEvent,
  type IPetOutcomeEvent,
  type IPhoto,
} from '~/lib/validators/petValidation';
import { Icons } from '../icons/Icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../primitives/AlertDialog';
import { Card } from '../primitives/Card';
import { Label } from '../primitives/Label';
import { RadioGroup, RadioGroupItem } from '../primitives/RadioButton';
import { Switch } from '../primitives/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../primitives/Tabs';
import { Textarea } from '../primitives/Textarea';
import BackgroundWavesFeaturedPets from '../utility/BackgroundWavesFeaturedPets';

interface Props {
  animalId: string;
}

export const MedicalEventTypeMap: Record<
  z.infer<typeof medicalEvent>['medicalEventType'],
  string
> = {
  VACCINATION: 'Vaccination',
  TREATMENT: 'Treatment',
  DIAGNOSIS: 'Diagnosis',
  MEDICATION: 'Medication',
  SURGERY: 'Surgery',
};

export const OutcomeEventTypeMap: Record<
  z.infer<typeof outcomeEvent>['eventType'],
  string
> = {
  ADOPTION: 'Adoption',
  TRANSFER: 'Transfer',
  EUTHANIZED: 'Euthanized',
  DIED: 'Died',
  RETURN: 'Return to Owner',
};

const PetDetailsForm: FC<Props> = ({ animalId }) => {
  const trpc = api.useContext().pet;
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation('common');

  const { data: pet } = api.pet.getPetById.useQuery({
    id: animalId,
  });

  const { data: medicalEvents } = api.pet.getPetMedicalEvents.useQuery({
    id: animalId,
  });

  const { data: outcomeEvents } = api.pet.getPetOutcomeEvents.useQuery({
    id: animalId,
  });

  const { data: documents } = api.pet.getPetDocuments.useQuery({
    id: animalId,
  });

  const { data: photos } = api.pet.getPetPhotos.useQuery({
    id: animalId,
  });

  const { data: notes } = api.pet.getPetNotes.useQuery({
    id: animalId,
  });

  const [avatarUrl, setAvatarUrl] = useState(pet?.image ?? '');
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);
  const [isAddingMedical, setIsAddingMedical] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isCostKnown, setIsCostKnown] = useState(false);

  const updatePetMutation = api.pet.updatePetById.useMutation({
    onSuccess: async () => {
      form.reset();
      await trpc.getPetById.invalidate();
    },
  });

  const updatePetMedicalEventMutation =
    api.pet.updatePetMedicalEventMutation.useMutation({
      onSuccess: async () => {
        medicalEventForm.reset();
        setIsAddingMedical(false);
        setIsCostKnown(false);
        await trpc.getPetMedicalEvents.invalidate();
      },
    });

  const updatePetOutcomeEventMutation =
    api.pet.updatePetOutcomeEventMutation.useMutation({
      onSuccess: async () => {
        outcomeEventForm.reset();
        setIsAddingOutcome(false);
        await trpc.getPetOutcomeEvents.invalidate();
      },
    });

  const updatePetDocumentMutation =
    api.pet.updatePetDocumentEventMutation.useMutation({
      onSuccess: async () => {
        documentForm.reset();
        setIsAddingDocument(false);
        await trpc.getPetDocuments.invalidate();
      },
    });

  const addPetPhotoMutation = api.pet.addPetPhotoMutation.useMutation({
    onSuccess: async () => {
      photoForm.reset();
      await trpc.getPetPhotos.invalidate();
    },
  });

  const addPetNoteMutation = api.pet.addPetNoteMutation.useMutation({
    onSuccess: async () => {
      notesForm.reset();
      setIsAddingNote(false);
      await trpc.getPetNotes.invalidate();
    },
  });

  const savePetAdoptionDetailsMutation =
    api.pet.savePetAdoptionDetailsMutation.useMutation({
      onSuccess: async () => {
        await trpc.getPetById.invalidate();
      },
    });

  const deletePetMutation = api.pet.deletePetById.useMutation({
    onSuccess: () => {
      router.push(links.animals);
    },
  });

  const deletePetMedicalEventMutation =
    api.pet.deletePetMedicalEventMutation.useMutation({
      onSuccess: async () => {
        await trpc.getPetMedicalEvents.invalidate();
      },
    });

  const deleteOutcomeEventMutation =
    api.pet.deletePetOutcomeEventMutation.useMutation({
      onSuccess: async () => {
        await trpc.getPetOutcomeEvents.invalidate();
      },
    });

  const deletePetDocumentMutation =
    api.pet.deletePetDocumentMutation.useMutation({
      onSuccess: async () => {
        await trpc.getPetDocuments.invalidate();
      },
    });

  const deletePetPhotoMutation = api.pet.deletePetPhotoMutation.useMutation({
    onSuccess: async () => {
      await trpc.getPetPhotos.invalidate();
    },
  });

  const deletePetNoteMutation = api.pet.deletePetNoteMutation.useMutation({
    onSuccess: async () => {
      await trpc.getPetNotes.invalidate();
    },
  });

  const deleteAnimal = async (animalId: string) => {
    await deletePetMutation.mutateAsync(animalId);
  };

  const deleteMedicalEvent = async (eventId: string, animalId: string) => {
    await deletePetMedicalEventMutation.mutateAsync({
      petId: animalId,
      eventId: eventId,
    });
    toast({
      description: t('delete_pet_medical_event_toast'),
      variant: 'success',
    });
  };

  const deleteOutcomeEvent = async (eventId: string, animalId: string) => {
    await deleteOutcomeEventMutation.mutateAsync({
      petId: animalId,
      eventId: eventId,
    });
    toast({
      description: t('delete_pet_outcome_event_toast'),
      variant: 'success',
    });
  };

  const deleteDocument = async (documentId: string, animalId: string) => {
    await deletePetDocumentMutation.mutateAsync({
      petId: animalId,
      documentId: documentId,
    });
    toast({
      description: t('delete_pet_document_toast'),
      variant: 'success',
    });
  };

  const deletePetPhoto = async (photoId: string, animalId: string) => {
    await deletePetPhotoMutation.mutateAsync({
      petId: animalId,
      photoId: photoId,
    });
    toast({
      description: t('delete_pet_photo_toast'),
      variant: 'success',
    });
  };

  const deletePetNote = async (noteId: string, animalId: string) => {
    await deletePetNoteMutation.mutateAsync({
      petId: animalId,
      noteId: noteId,
    });
    toast({
      description: t('delete_pet_note_toast'),
      variant: 'success',
    });
  };

  const form = useForm<IPetFullDetails>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      console.log('formData', data);
      console.log(
        'validation result',
        await zodResolver(fullPetDetailsSchema)(data, context, options)
      );
      return zodResolver(fullPetDetailsSchema)(data, context, options);
    },
    defaultValues: {
      ...pet,
      image: pet?.image ?? '/images/no-profile-picture.svg',
      name: pet?.name ?? '',
      internalId: pet?.internalId ?? '',
      status: pet?.status ?? '',
      dateOfBirth: pet?.dateOfBirth?.toISOString().split('T')[0],
      gender: pet?.gender ?? '',
      coat: pet?.coat ?? '',
      color: pet?.color ?? '',
      species: pet?.species ?? '',
      breed: pet?.breed ?? '',
      microchipNumber: pet?.microchipNumber ?? '',
      microchipBrand: pet?.microchipBrand ?? '',
      weight: pet?.weight?.toString(),
      adoptionFee: pet?.adoptionFee?.toString() ?? '',
      description: pet?.description ?? '',
      intakeEventDate: pet?.intakeEventDate?.toISOString().split('T')[0],
    } as IPetFullDetails,
  });

  const onSubmit = async (values: IPetFullDetails) => {
    try {
      if (values.intakeEventDate) {
        values.intakeEventDate = mapIntakeEventDate(values.intakeEventDate);
      }
      await updatePetMutation.mutateAsync({ id: animalId, pet: { ...values } });
      toast({
        description: t('update_pet_form_toast_success', { name: values.name }),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const medicalEventForm = useForm<IPetMedicalEvent>({
    resolver: zodResolver(medicalEvent),
    defaultValues: {
      eventDate: new Date().toISOString().split('T')[0],
    },
  });

  const onMedicalEventSubmit = async (values: IPetMedicalEvent) => {
    try {
      if (values.eventDate) {
        values.eventDate =
          mapIntakeEventDate(values.eventDate) ?? new Date().toISOString();
      }
      if (values.knownCost !== undefined) {
        values.knownCost = undefined;
      }
      await updatePetMedicalEventMutation.mutateAsync({
        petId: animalId,
        event: { ...values },
      });
      toast({
        description: t('update_pet_medical_toast_success', {
          name: values.medicalEventType,
        }),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const outcomeEventForm = useForm<IPetOutcomeEvent>({
    resolver: zodResolver(outcomeEvent),
    defaultValues: {
      eventDate: new Date().toISOString().split('T')[0],
    },
  });

  const onOutcomeEventFormSubmit = async (values: IPetOutcomeEvent) => {
    try {
      if (values.eventDate) {
        values.eventDate =
          mapIntakeEventDate(values.eventDate) ?? new Date().toISOString();
      }
      await updatePetOutcomeEventMutation.mutateAsync({
        petId: animalId,
        event: { ...values },
      });
      toast({
        description: t('update_pet_outcome_toast_success', {
          name: values.eventType,
        }),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const documentForm = useForm<IDocument>({
    resolver: zodResolver(document),
  });

  const onDocumentFormSubmit = async (values: IDocument) => {
    try {
      values.type = getDocumentType(values.url);
      await updatePetDocumentMutation.mutateAsync({
        petId: animalId,
        document: { ...values },
      });
      toast({
        description: t('update_pet_document_toast_success', {
          name: values.name,
        }),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const photoForm = useForm<IPhoto>({
    resolver: zodResolver(photo),
  });

  const onPhotoFormSubmit = async (values: IPhoto) => {
    try {
      await addPetPhotoMutation.mutateAsync({
        petId: animalId,
        photo: { ...values },
      });
      toast({
        description: t('update_pet_photos_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const notesForm = useForm<INote>({
    resolver: zodResolver(note),
  });

  const onNotesFormSubmit = async (values: INote) => {
    try {
      await addPetNoteMutation.mutateAsync({
        petId: animalId,
        note: { ...values },
      });
      toast({
        description: t('add_pet_note_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  type AdoptionFormValues = Pick<IPetFullDetails, 'availableForAdoption'> &
    Pick<IPetFullDetails, 'description'> &
    Pick<IPetFullDetails, 'adoptionFeeKnown'> &
    Pick<IPetFullDetails, 'adoptionFee'>;

  const onAdoptionFormSubmit = async (values: AdoptionFormValues) => {
    try {
      await savePetAdoptionDetailsMutation.mutateAsync({
        petId: animalId,
        values: { ...values },
      });
      toast({
        description: t('add_pet_adoption_details_toast_success'),
        variant: 'success',
      });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof ZodError ||
        error instanceof TRPCClientError
      ) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <Tabs defaultValue="details">
        <div className="absolute w-full">
          <div className="flex items-center justify-center bg-primary-200">
            <TabsList className="absolute top-5 m-2 flex flex-wrap">
              <TabsTrigger
                value="details"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_details')}
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_events')}
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_medical')}
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_documents')}
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_notes')}
              </TabsTrigger>
              <TabsTrigger
                value="adoption"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_adoption')}
              </TabsTrigger>
            </TabsList>
          </div>
          <BackgroundWavesFeaturedPets className="absolute -z-10 aspect-[10/1] w-full rotate-180" />
        </div>
        {pet && (
          <div className="p-4">
            <div className="mx-auto w-full max-w-7xl p-4 px-4 py-5 sm:mt-10 sm:p-6 2xl:max-w-8xl">
              <TabsContent value="details">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                  >
                    <div className="col-span-6 flex flex-col items-center gap-6 md:flex-row">
                      <Avatar className="col-span-5 mt-24 h-80 w-80 md:mt-0">
                        <AvatarImage
                          src={avatarUrl}
                          alt="Avatar image"
                        />
                        <AvatarFallback>
                          <Image
                            className="opacity-70"
                            width="400"
                            height="400"
                            src="/images/no-profile-picture.svg"
                            alt="Default avatar image"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <div className="z-0 items-center justify-center space-y-4 md:mt-10">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              setAvatarUrl(res[0]?.url as string);
                              form.setValue('image', res[0]?.url as string);
                              toast({
                                description: t(
                                  'pet_image_toast_upload_success'
                                ),
                                variant: 'success',
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              description: error.message,
                              variant: 'destructive',
                            });
                          }}
                        />
                        <Button
                          className="text-base"
                          variant={'destructive'}
                          size="lg"
                          disabled={!avatarUrl || avatarUrl === ''}
                          onClick={() => {
                            setAvatarUrl('');
                            form.setValue('image', '');
                          }}
                        >
                          {t('remove_image')}
                        </Button>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>{t('add_pet_form_label_name')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="internalId"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_internal_id')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_status')}
                          </FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_status'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="adoptable">
                                Adoptable
                              </SelectItem>
                              <SelectItem value="quarantined">
                                Quarantined
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>{t('form_label_dob')}</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="border-b-2 border-l-0 border-r-0 border-t-0"
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_gender')}
                          </FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_gender'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coat"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>{t('add_pet_form_label_coat')}</FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_coat'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hairless">Hairless</SelectItem>
                              <SelectItem value="short">Short</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="long">Long</SelectItem>
                              <SelectItem value="wire">Wire</SelectItem>
                              <SelectItem value="curly">Curly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>{t('add_pet_form_label_color')}</FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_color'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="white">White</SelectItem>
                              <SelectItem value="black">Black</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_weight')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-6" />
                    <FormField
                      control={form.control}
                      name="species"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_species')}
                          </FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_species'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dog">Dog</SelectItem>
                              <SelectItem value="cat">Cat</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>{t('add_pet_form_label_breed')}</FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_breed'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cockerSpaniel">
                                Cocker Spaniel
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="microchipNumber"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_microchip')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="microchipBrand"
                      render={({ field }) => (
                        <FormItem className="col-span-6 sm:col-span-3">
                          <FormLabel>
                            {t('add_pet_form_label_microchip_brand')}
                          </FormLabel>
                          <Select
                            onValueChange={
                              field.onChange as (value: string) => void
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'add_pet_form_placeholder_microchip'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AVID">AVID</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="hidden lg:col-span-6 lg:block lg:h-6" />
                    <FormField
                      control={form.control}
                      name="friendlyWithDogs"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_friendly_dogs', { name: pet.name })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="friendlyWithCats"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_friendly_cats', { name: pet.name })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="friendlyWithChildren"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_friendly_children', {
                              name: pet.name,
                            })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="neutered"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_neutered', { name: pet.name })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="houseTrained"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_house_trained', { name: pet.name })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialNeeds"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_special_needs', { name: pet.name })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="aggressive"
                      render={({ field }) => (
                        <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                          <FormLabel>
                            {t('pet_form_aggresive', { name: pet.name })}
                          </FormLabel>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="max-w grid grid-cols-2 gap-8 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="true"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_yes')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                <FormControl>
                                  <RadioGroupItem
                                    value="false"
                                    className="sr-only"
                                  />
                                </FormControl>
                                <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                  <span className="block w-full p-2 text-center text-base font-normal">
                                    {t('pet_form_no')}
                                  </span>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {pet.species === 'cat' && (
                      <FormField
                        control={form.control}
                        name="declawed"
                        render={({ field }) => (
                          <FormItem className="col-span-6 space-y-1 sm:col-span-3">
                            <FormLabel>
                              {t('pet_form_declawed', { name: pet.name })}
                            </FormLabel>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                              className="max-w grid grid-cols-2 gap-8 pt-2"
                            >
                              <FormItem>
                                <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                  <FormControl>
                                    <RadioGroupItem
                                      value="true"
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                    <span className="block w-full p-2 text-center text-base font-normal">
                                      {t('pet_form_yes')}
                                    </span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem>
                                <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                  <FormControl>
                                    <RadioGroupItem
                                      value="false"
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                    <span className="block w-full p-2 text-center text-base font-normal">
                                      {t('pet_form_no')}
                                    </span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="col-span-6 mt-2 flex flex-col gap-3 md:flex-row">
                      <Button
                        type="submit"
                        className="justify-self-start"
                        size="lg"
                        disabled={!form.formState.isDirty}
                      >
                        {t('pet_details_form_update_button', {
                          name: pet.name,
                        })}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="justify-self-start"
                            size="lg"
                            variant={'destructive'}
                          >
                            {t('pet_details_form_delete_button', {
                              name: pet.name,
                            })}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('pet_form_delete_confirmation', {
                                name: pet.name,
                              })}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('pet_form_delete_confirmation_description', {
                                name: pet.name,
                              })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t('pet_events_cancel_button')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAnimal(pet.id)}
                              className={buttonVariants({
                                variant: 'destructive',
                              })}
                            >
                              {t('pet_details_form_delete_button', {
                                name: pet.name,
                              })}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="events">
                <div className="md:mt-38 mt-32 flex flex-col gap-3 p-4 lg:mt-40">
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      className="text-base"
                      onClick={() => setIsAddingOutcome(true)}
                      disabled={isAddingOutcome}
                    >
                      <Icons.plus className="mr-2 h-4 w-4" />{' '}
                      {t('pet_events_outcome_event_button')}
                    </Button>
                  </div>
                  {isAddingOutcome && (
                    <Card className="mt-12 flex flex-col gap-3 p-10">
                      <div className="flex items-center justify-between pb-4">
                        <h2 className="flex items-center text-3xl font-semibold">
                          {t('pet_details_form_outcome_event')}
                          <Icons.arrowUpRight className="ml-2" />
                        </h2>
                      </div>
                      <Form {...outcomeEventForm}>
                        <form
                          onSubmit={outcomeEventForm.handleSubmit(
                            onOutcomeEventFormSubmit
                          )}
                          className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                        >
                          <FormField
                            control={outcomeEventForm.control}
                            name="eventType"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('add_pet_form_label_outcome_type')}
                                </FormLabel>
                                <Select
                                  onValueChange={
                                    field.onChange as (value: string) => void
                                  }
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t(
                                          'add_pet_form_placeholder_outcome'
                                        )}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {outcomeEvent.shape.eventType.options.map(
                                      (op) => (
                                        <SelectItem
                                          key={op.value}
                                          value={op.value}
                                        >
                                          {OutcomeEventTypeMap[op.value]}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={outcomeEventForm.control}
                            name="eventDate"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('add_pet_form_label_outcome_date')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="border-b-2 border-l-0 border-r-0 border-t-0"
                                    placeholder=""
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="submit"
                              className="w-fit justify-self-start"
                              size="lg"
                              disabled={!outcomeEventForm.formState.isDirty}
                            >
                              {t('pet_events_add_button')}
                            </Button>
                            <Button
                              className="w-fit justify-self-start"
                              size="lg"
                              variant="destructive"
                              onClick={() => setIsAddingOutcome(false)}
                            >
                              {t('pet_events_cancel_button')}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </Card>
                  )}
                  {outcomeEvents &&
                    outcomeEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="relative mt-12 flex flex-col gap-3 p-10"
                      >
                        <Icons.arrowUpRight className="absolute -left-3 -top-3" />
                        <div className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <Label className="text-lg">
                              {t('add_pet_form_label_medical_type')}
                            </Label>
                            <Input
                              className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0 text-base"
                              placeholder=""
                              value={event.eventType}
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <Label className="text-lg">
                              {t('add_pet_form_label_medical_date')}
                            </Label>
                            <Input
                              type="text"
                              className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0 text-base"
                              placeholder=""
                              value={
                                event.eventDate.toISOString().split('T')[0]
                              }
                            />
                          </div>
                        </div>
                        <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                          <Button
                            className="w-fit justify-self-start"
                            size="lg"
                            variant="destructive"
                            onClick={() =>
                              deleteOutcomeEvent(event.id, animalId)
                            }
                          >
                            {t('pet_medical_events_delete_button')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  <Card className="mt-12 flex flex-col gap-3 p-10">
                    <div className="flex items-center justify-between pb-4">
                      <h2 className="flex items-center text-3xl font-semibold">
                        {t('pet_details_form_intake_event')}
                        <Icons.arrowDownRight className="ml-2" />
                      </h2>
                    </div>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                      >
                        <FormField
                          control={form.control}
                          name="intakeEventDate"
                          render={({ field }) => (
                            <FormItem className="col-span-6 sm:col-span-3">
                              <FormLabel>
                                {t('add_pet_form_label_intake_date')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="border-b-2 border-l-0 border-r-0 border-t-0"
                                  placeholder=""
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="intakeEventType"
                          render={({ field }) => (
                            <FormItem className="col-span-6 sm:col-span-3">
                              <FormLabel>
                                {t('add_pet_form_label_intake_type')}
                              </FormLabel>
                              <Select
                                onValueChange={
                                  field.onChange as (value: string) => void
                                }
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        'add_pet_form_placeholder_intake'
                                      )}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fullPetDetailsSchema.shape.intakeEventType.options.map(
                                    (op) => (
                                      <SelectItem
                                        key={op.value}
                                        value={op.value}
                                      >
                                        {IntakeEventTypeMap[op.value]}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="healthStatus"
                          render={({ field }) => (
                            <FormItem className="col-span-6 sm:col-span-3">
                              <FormLabel>
                                {t('add_pet_form_label_health')}
                              </FormLabel>
                              <Select
                                onValueChange={
                                  field.onChange as (value: string) => void
                                }
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        'add_pet_form_placeholder_health'
                                      )}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fullPetDetailsSchema.shape.healthStatus.options.map(
                                    (op) => (
                                      <SelectItem
                                        key={op.value}
                                        value={op.value}
                                      >
                                        {HealthStatusMap[op.value]}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-6 mt-2 flex gap-3">
                          <Button
                            type="submit"
                            className="col-span-6 justify-self-start"
                            size="lg"
                            disabled={!form.formState.isDirty}
                          >
                            {t('pet_details_form_edit_button')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="medical">
                <div className="md:mt-38 mt-32 flex flex-col gap-3 p-4 lg:mt-40">
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      className="text-sm md:text-base"
                      onClick={() => setIsAddingMedical(true)}
                      disabled={isAddingMedical}
                    >
                      <Icons.plus className="mr-2 h-4 w-4" />{' '}
                      {t('pet_events_medical_event_button')}
                    </Button>
                  </div>
                  {isAddingMedical && (
                    <Card className="mt-12 flex flex-col gap-3 p-10">
                      <div className="flex items-center justify-between pb-4">
                        <h2 className="flex items-center text-3xl font-semibold">
                          {t('pet_details_form_medical_event')}
                          <Icons.health className="ml-2" />
                        </h2>
                      </div>
                      <Form {...medicalEventForm}>
                        <form
                          onSubmit={medicalEventForm.handleSubmit(
                            onMedicalEventSubmit
                          )}
                          className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                        >
                          <FormField
                            control={medicalEventForm.control}
                            name="medicalEventType"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('add_pet_form_label_medical_type')}
                                </FormLabel>
                                <Select
                                  onValueChange={
                                    field.onChange as (value: string) => void
                                  }
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t(
                                          'add_pet_form_placeholder_medical_type'
                                        )}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {medicalEvent.shape.medicalEventType.options.map(
                                      (op) => (
                                        <SelectItem
                                          key={op.value}
                                          value={op.value}
                                        >
                                          {MedicalEventTypeMap[op.value]}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={medicalEventForm.control}
                            name="eventDate"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('add_pet_form_label_medical_date')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="border-b-2 border-l-0 border-r-0 border-t-0"
                                    placeholder=""
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={medicalEventForm.control}
                            name="knownCost"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('add_pet_form_label_medical_knownCost')}
                                </FormLabel>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value?.toString()}
                                  className="max-w grid grid-cols-2 gap-8 pt-2"
                                >
                                  <FormItem>
                                    <FormLabel className="[&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                      <FormControl>
                                        <RadioGroupItem
                                          value="true"
                                          onClick={() => setIsCostKnown(true)}
                                          className="sr-only"
                                        />
                                      </FormControl>
                                      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                        <span className="block w-full p-2 text-center text-base font-normal">
                                          {t('pet_form_yes')}
                                        </span>
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem>
                                    <FormLabel className="transition-all ease-linear [&:has([data-state=checked])>div]:border-primary-300 [&:has([data-state=checked])>div]:text-primary-300">
                                      <FormControl>
                                        <RadioGroupItem
                                          value="false"
                                          onClick={() => setIsCostKnown(false)}
                                          className="sr-only"
                                        />
                                      </FormControl>
                                      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 transition-all ease-linear hover:cursor-pointer hover:border-primary-300 hover:text-accent-foreground hover:text-primary-300">
                                        <span className="block w-full p-2 text-center text-base font-normal">
                                          {t('pet_form_no')}
                                        </span>
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {isCostKnown && (
                            <>
                              <div className="sm:col-span-3" />
                              <FormField
                                control={medicalEventForm.control}
                                name="cost"
                                render={({ field }) => (
                                  <FormItem className="col-span-6 sm:col-span-3">
                                    <FormLabel>
                                      {t('add_pet_form_label_medical_cost')}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder=""
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}
                          <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="submit"
                              className="w-fit justify-self-start"
                              size="lg"
                              disabled={!medicalEventForm.formState.isDirty}
                            >
                              {t('pet_events_add_button')}
                            </Button>
                            <Button
                              className="w-fit justify-self-start"
                              size="lg"
                              variant="destructive"
                              onClick={() => setIsAddingMedical(false)}
                            >
                              {t('pet_events_cancel_button')}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </Card>
                  )}
                  {medicalEvents &&
                    medicalEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="relative mt-12 flex flex-col gap-3 p-10"
                      >
                        <Icons.health className="absolute -left-3 -top-3" />
                        <div className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <Label className="text-lg">
                              {t('add_pet_form_label_medical_type')}
                            </Label>
                            <Input
                              className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0 text-base"
                              placeholder=""
                              value={event.medicalEventType}
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <Label className="text-lg">
                              {t('add_pet_form_label_medical_date')}
                            </Label>
                            <Input
                              type="text"
                              className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0 text-base"
                              placeholder=""
                              value={
                                event.eventDate.toISOString().split('T')[0]
                              }
                            />
                          </div>
                          {event.cost && (
                            <div className="col-span-6 sm:col-span-3">
                              <Label className="text-lg">
                                {t('add_pet_form_label_medical_cost')}
                              </Label>
                              <Input
                                type="text"
                                className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0 text-base"
                                placeholder=""
                                value={
                                  event.cost !== null ? event.cost : undefined
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                          <Button
                            className="w-fit justify-self-start"
                            size="lg"
                            variant="destructive"
                            onClick={() =>
                              deleteMedicalEvent(event.id, animalId)
                            }
                          >
                            {t('pet_medical_events_delete_button')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="md:mt-38 mt-32 flex flex-col gap-3 p-4 lg:mt-40">
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      className="text-base"
                      onClick={() => setIsAddingDocument(true)}
                      disabled={isAddingDocument}
                    >
                      <Icons.plus className="mr-2 h-4 w-4" />{' '}
                      {t('pet_add_document_button')}
                    </Button>
                  </div>
                  {isAddingDocument && (
                    <Card className="mt-12 flex flex-col gap-3 p-10 lg:mx-auto lg:w-3/4">
                      <div className="flex items-center justify-between pb-4">
                        <h2 className="flex items-center text-3xl font-semibold">
                          {t('pet_details_form_document')}
                          <Icons.document className="ml-2" />
                        </h2>
                      </div>
                      <Form {...documentForm}>
                        <form
                          onSubmit={documentForm.handleSubmit(
                            onDocumentFormSubmit
                          )}
                          className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                        >
                          <FormField
                            control={documentForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('pet_form_document_name')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder=""
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {documentForm.getValues('url') && (
                            <FormField
                              control={documentForm.control}
                              name="url"
                              render={({ field }) => (
                                <FormItem className="col-span-6 hidden sm:col-span-3">
                                  <FormLabel>
                                    {t('pet_form_document_url')}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder=""
                                      disabled
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          <div className="col-span-6 flex flex-col items-center gap-6 md:flex-row">
                            <div className="items-center justify-center space-x-4 space-y-4 md:z-10">
                              <UploadButton
                                endpoint="documentUploader"
                                onClientUploadComplete={(res) => {
                                  if (res) {
                                    documentForm.setValue(
                                      'url',
                                      res[0]?.url as string
                                    );
                                    toast({
                                      description: t(
                                        'pet_image_toast_upload_success'
                                      ),
                                      variant: 'success',
                                    });
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  toast({
                                    description: error.message,
                                    variant: 'destructive',
                                  });
                                }}
                              />
                              <Button
                                className="text-base"
                                variant={'destructive'}
                                size="lg"
                                onClick={() => {
                                  documentForm.setValue('url', '');
                                }}
                              >
                                {t('pet_document_remove_button')}
                              </Button>
                              {documentForm.getValues('url') && (
                                <Link
                                  href={documentForm.getValues('url')}
                                  target="_blank"
                                  className={cn(
                                    buttonVariants({
                                      variant: 'default',
                                      size: 'lg',
                                    }),
                                    'text-base'
                                  )}
                                >
                                  Preview document
                                </Link>
                              )}
                            </div>
                          </div>
                          <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="submit"
                              className="w-fit justify-self-start"
                              size="lg"
                              disabled={!documentForm.formState.isDirty}
                            >
                              {t('pet_documents_add_button')}
                            </Button>
                            <Button
                              className="w-fit justify-self-start"
                              size="lg"
                              variant="destructive"
                              onClick={() => setIsAddingDocument(false)}
                            >
                              {t('pet_events_cancel_button')}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </Card>
                  )}
                  <div className="gap-8 md:grid md:grid-cols-2 md:pt-10">
                    {documents &&
                      documents.map((document) => (
                        <Card
                          key={document.id}
                          className="relative mt-12 flex flex-col gap-3 p-10"
                        >
                          <Icons.document className="absolute -left-3 -top-3" />
                          <div className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <Label className="text-lg">
                                {t('pet_form_document_name')}
                              </Label>
                              <Input
                                className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0 text-base"
                                placeholder=""
                                value={document.name}
                              />
                            </div>
                          </div>
                          <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                            <Link
                              href={document.url}
                              target="_blank"
                              className={buttonVariants({
                                variant: 'default',
                                size: 'lg',
                              })}
                            >
                              {t('pet_document_preview_button')}
                            </Link>
                            <Button
                              className="w-fit justify-self-start"
                              size="lg"
                              variant="destructive"
                              onClick={() =>
                                deleteDocument(document.id, animalId)
                              }
                            >
                              {t('pet_document_delete_button')}
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="md:mt-38 mt-32 flex flex-col gap-3 p-4 lg:mt-40">
                  <div className="flex items-center justify-center">
                    <Button
                      size="lg"
                      className="text-base"
                      onClick={() => setIsAddingNote(true)}
                      disabled={isAddingNote}
                    >
                      <Icons.plus className="mr-2 h-4 w-4" />{' '}
                      {t('pet_note_add_button')}
                    </Button>
                  </div>
                  {isAddingNote && (
                    <Card className="relative mt-12 flex flex-col gap-3 p-10 lg:mx-auto lg:w-3/4">
                      <Icons.note className="absolute -left-3 -top-3" />
                      <Form {...notesForm}>
                        <form
                          onSubmit={notesForm.handleSubmit(onNotesFormSubmit)}
                          className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                        >
                          <FormField
                            control={notesForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="col-span-5 md:col-span-4">
                                <FormLabel>
                                  {t('add_pet_note_label_title')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder=""
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={notesForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem className="col-span-6">
                                <FormLabel>
                                  {t('add_pet_note_label_content')}
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    rows={5}
                                    className="resize-none"
                                    value={field.value}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                            <Button
                              type="submit"
                              className="w-fit justify-self-start"
                              size="lg"
                              disabled={!notesForm.formState.isDirty}
                            >
                              {t('pet_note_create_button')}
                            </Button>
                            <Button
                              className="w-fit justify-self-start"
                              size="lg"
                              variant="destructive"
                              onClick={() => setIsAddingNote(false)}
                            >
                              {t('pet_note_cancel_button')}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </Card>
                  )}
                  <div className="space-y-8 sm:space-y-0 md:grid md:grid-cols-2 md:gap-8 md:pt-10">
                    {notes &&
                      notes.map((note) => (
                        <Card
                          key={note.id}
                          className="relative mt-4 flex flex-col justify-between gap-3 p-10 sm:mt-0"
                        >
                          <Icons.note className="absolute -left-3 -top-3" />
                          <div className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6">
                            <div className="col-span-5 md:col-span-4">
                              {note.title && (
                                <h2
                                  className="mt-3 border-b-2 border-l-0 border-r-0 border-t-0
                                pb-1 text-xl"
                                >
                                  {note.title}
                                </h2>
                              )}
                            </div>
                            <div className="col-span-6">
                              <p className="mb-3 text-lg">{note.content}</p>
                            </div>
                          </div>
                          <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                            <Button
                              className="w-fit justify-self-start"
                              size="lg"
                              variant="destructive"
                              onClick={() =>
                                deletePetNote(String(note.id), animalId)
                              }
                            >
                              {t('pet_note_delete_button')}
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="adoption">
                <div className="lg:mt-38 mt-32 flex flex-col gap-3 p-4 md:mt-36">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onAdoptionFormSubmit)}
                      className="w-full space-y-6"
                    >
                      <div>
                        <h3
                          className="mb-6 scroll-m-20 text-xl font-medium
                   tracking-tight lg:text-4xl"
                        >
                          {t('pet_adoption_title')}
                        </h3>
                        <div className="space-y-4 pb-6">
                          <FormField
                            control={form.control}
                            name="availableForAdoption"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:w-2/3">
                                <div className="space-y-0.5">
                                  <FormLabel>
                                    {t('pet_adoption_available')}
                                  </FormLabel>
                                  <FormDescription>
                                    {field.value
                                      ? t('pet_adoption_available_yes_answer', {
                                          name: pet.name,
                                        })
                                      : t('pet_adoption_available_no_answer', {
                                          name: pet.name,
                                        })}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="adoptionFeeKnown"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:w-2/3">
                                <div className="space-y-0.5">
                                  <FormLabel>
                                    {t('pet_adoption_fee_known')}
                                  </FormLabel>
                                  <FormDescription>
                                    {field.value
                                      ? t('pet_adoption_fee_known_yes_answer')
                                      : t('pet_adoption_fee_known_no_answer')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={
                                      form.watch('availableForAdoption') &&
                                      field.value
                                    }
                                    onCheckedChange={field.onChange}
                                    disabled={
                                      !form.watch('availableForAdoption')
                                    }
                                    aria-readonly
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-6">
                          {form.watch('adoptionFeeKnown') &&
                            form.watch('availableForAdoption') && (
                              <FormField
                                control={form.control}
                                name="adoptionFee"
                                render={({ field }) => (
                                  <FormItem className="w-full md:w-72">
                                    <FormLabel>
                                      {t('pet_adoption_fee_label')}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={t(
                                          'pet_adoption_fee_placeholder'
                                        )}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          {form.watch('availableForAdoption') && (
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem className="col-span-6">
                                  <FormLabel>
                                    {t('pet_adoption_description_label')}
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      rows={5}
                                      className="resize-none"
                                      placeholder={field.value}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t('pet_adoption_description_subtitle')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>
                      <Button
                        className="my-4 w-fit text-base"
                        variant={'default'}
                        size="lg"
                        type="submit"
                        disabled={!form.formState.isDirty}
                      >
                        {t('pet_save_adoption_button')}
                      </Button>
                    </form>
                  </Form>
                  <h4
                    className="mt-24 scroll-m-20 text-xl
                   font-medium tracking-tight lg:text-4xl"
                  >
                    {t('pet_adoption_photos', { name: pet.name })}
                  </h4>
                  <p className="mb-12 leading-7">
                    {t('pet_adoption_photos_subtitle')}
                  </p>
                  <Form {...photoForm}>
                    <form onSubmit={photoForm.handleSubmit(onPhotoFormSubmit)}>
                      <FormField
                        control={photoForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem className="col-span-6 hidden sm:col-span-3">
                            <FormLabel>{t('pet_form_photo_url')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                disabled
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {photoForm.getValues('url') && (
                        <div className="flex w-full justify-center pb-6">
                          <Card className="flex flex-col gap-3 p-10">
                            <Image
                              width="400"
                              height="400"
                              className="h-full w-full rounded-lg object-cover"
                              src={photoForm.getValues('url')}
                              alt={''}
                            />
                          </Card>
                        </div>
                      )}
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res) {
                            photoForm.setValue('url', res[0]?.url as string);
                            toast({
                              description: t('pet_image_toast_upload_success'),
                              variant: 'success',
                            });
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            description: error.message,
                            variant: 'destructive',
                          });
                        }}
                      />
                      <div className="flex w-full flex-col items-center justify-center gap-6">
                        {photoForm.getValues('url') && (
                          <Button
                            className="my-4 w-fit text-base"
                            variant={'default'}
                            size="lg"
                            type="submit"
                          >
                            {t('pet_photo_save_button')}
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                  {photos && (
                    <>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {photos.map((photo) => (
                          <Card
                            key={photo.id}
                            className="flex flex-col gap-3 p-10"
                          >
                            <Image
                              width="400"
                              height="400"
                              className="h-full w-full rounded-lg object-cover"
                              src={photo.url}
                              alt="Pet photo"
                            />
                            <div className="col-span-6 mt-2 flex flex-col gap-3 sm:flex-row">
                              <Button
                                className="w-fit justify-self-start"
                                size="lg"
                                variant="destructive"
                                onClick={() =>
                                  deletePetPhoto(photo.id, animalId)
                                }
                              >
                                {t('pet_photo_delete_button')}
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default PetDetailsForm;
