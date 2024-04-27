import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError, type z } from 'zod';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/lib/api';
import { UploadButton } from '~/lib/uploadthing';
import { mapIntakeEventDate } from '~/lib/utils';
import {
  petDetailsSchema,
  type IPetDetails,
} from '~/lib/validators/petValidation';
import { Icons } from '../icons/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '../primitives/Avatar';
import { Button } from '../primitives/Button';
import { Card } from '../primitives/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../primitives/Form';
import { Input } from '../primitives/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/Select';
import Spinner from '../spinner/Spinner';
import BackgroundWavesFeaturedPets from '../utility/BackgroundWavesFeaturedPets';

export const HealthStatusMap: Record<
  z.infer<typeof petDetailsSchema>['healthStatus'],
  string
> = {
  HEALTHY: 'Healthy',
  SICK: 'Sick',
  INJURED: 'Injured',
  DEAD: 'Dead',
  TREATED: 'Treated',
  QUARANTINE: 'Quarantine',
  UNKNOWN: 'Unknown',
};

export const IntakeEventTypeMap: Record<
  z.infer<typeof petDetailsSchema>['intakeEventType'],
  string
> = {
  STRAY: 'Stray',
  TRANSFER: 'Transfer',
  SURRENDER: 'Surrender',
  BORN: 'Born',
  RETURN: 'Return',
  UNKNOWN: 'Unknown',
};

const AddPetForm = () => {
  const trpc = api.useContext().pet;
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation('common');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [addingAnotherAnimal, setAddingAnotherAnimal] = useState(false);

  const addPetMutation = api.pet.add.useMutation({
    onSuccess: async () => {
      await trpc.getAllPetsDataForTable.invalidate();
    },
    onSettled(data) {
      form.reset();
      setAvatarUrl('');
      if (data && !addingAnotherAnimal) {
        router.push(links.animal(data.id));
      }
      if (addingAnotherAnimal) {
        router.refresh();
      }
    },
  });

  const form = useForm<IPetDetails>({
    resolver: zodResolver(petDetailsSchema),
    defaultValues: {
      //TODO: decide if any should be set as default values
      intakeEventDate: new Date().toISOString().slice(0, 10),
      dateOfBirth: new Date().toISOString().slice(0, 10),
      intakeEventType: 'UNKNOWN',
      healthStatus: 'UNKNOWN',
    },
  });

  const onSubmit = async (values: IPetDetails) => {
    try {
      if (values.intakeEventDate) {
        values.intakeEventDate = mapIntakeEventDate(values.intakeEventDate);
      }
      await addPetMutation.mutateAsync(values);
      toast({
        description: t('add_pet_form_toast_success', { name: values.name }),
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
    <div className="pb-4">
      <BackgroundWavesFeaturedPets className="absolute -z-10 aspect-[10/1] w-full rotate-180" />
      <Card className="mx-auto mt-4 w-full max-w-7xl p-4 px-4 py-5 sm:mt-6 sm:p-10 2xl:max-w-8xl">
        <p className="mb-6 font-sans text-4xl tracking-wide text-foreground underline decoration-2 underline-offset-4 sm:text-6xl">
          {t('add_pet_form_title')}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
          >
            <div className="col-span-6 flex flex-col items-center gap-6 md:flex-row">
              <Avatar className="col-span-5 mt-16 h-64 w-64 md:mt-0">
                <AvatarImage
                  src={avatarUrl ?? '/images/no-profile-picture.svg'}
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
              <div className="items-center justify-center space-y-4 md:z-10 md:mt-10">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    res && setAvatarUrl(res[0]?.fileUrl as string);
                    res && form.setValue('image', res[0]?.fileUrl as string);
                    toast({
                      description: t('pet_image_toast_upload_success'),
                      variant: 'success',
                    });
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      description: error.message,
                      variant: 'destructive',
                    });
                  }}
                  onUploadProgress={() => {
                    <Spinner />;
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
                  <FormLabel>{t('add_pet_form_label_internal_id')}</FormLabel>
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
                  <FormLabel>{t('add_pet_form_label_status')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_status')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="adoptable">Adoptable</SelectItem>
                      <SelectItem value="quarantined">Quarantined</SelectItem>
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
                  <FormLabel>{t('add_pet_form_label_gender')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_gender')}
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
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_coat')}
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
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_color')}
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
                  <FormLabel>{t('add_pet_form_label_weight')}</FormLabel>
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
                  <FormLabel>{t('add_pet_form_label_species')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_species')}
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
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_breed')}
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
                  <FormLabel>{t('add_pet_form_label_microchip')}</FormLabel>
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
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_microchip')}
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
            <div className="col-span-6" />
            <FormField
              control={form.control}
              name="intakeEventDate"
              render={({ field }) => (
                <FormItem className="col-span-6 sm:col-span-3">
                  <FormLabel>{t('add_pet_form_label_intake_date')}</FormLabel>
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
                  <FormLabel>{t('add_pet_form_label_intake_type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_intake')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {petDetailsSchema.shape.intakeEventType.options.map(
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
                  <FormLabel>{t('add_pet_form_label_health')}</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('add_pet_form_placeholder_health')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {petDetailsSchema.shape.healthStatus.options.map((op) => (
                        <SelectItem
                          key={op.value}
                          value={op.value}
                        >
                          {HealthStatusMap[op.value]}
                        </SelectItem>
                      ))}
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
                onClick={() => setAddingAnotherAnimal(false)}
                size="lg"
                disabled={addPetMutation.isLoading}
              >
                {addPetMutation.isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t('form_button_save')
                )}
              </Button>
              <Button
                type="submit"
                className="justify-self-start"
                size="lg"
                disabled={addPetMutation.isLoading}
                onClick={() => setAddingAnotherAnimal(true)}
              >
                {addPetMutation.isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t('add_pet_form_button_save_add_another')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddPetForm;
