import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';
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
import { Button } from '~/components/primitives/Button';
import {
  Form,
  FormControl,
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
import { useToast } from '~/hooks/use-toast';
import { api } from '~/lib/api';
import { UploadButton } from '~/lib/uploadthing';
import { mapIntakeEventDate } from '~/lib/utils';
import {
  fullPetDetailsSchema,
  type IPetFullDetails,
} from '~/lib/validators/petValidation';
import { Icons } from '../icons/Icons';
import { Card } from '../primitives/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../primitives/Tabs';
import BackgroundWavesFeaturedPets from '../utility/BackgroundWavesFeaturedPets';

interface Props {
  animalId: string;
}

const PetDetailsForm: FC<Props> = ({ animalId }) => {
  const trpc = api.useContext().pet;
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation('common');

  const { data: pet } = api.pet.getPetById.useQuery({
    id: animalId,
  });

  const [avatarUrl, setAvatarUrl] = useState(pet?.image ?? '');
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);

  const updatePetMutation = api.pet.updatePetById.useMutation({
    onSuccess: async () => {
      form.reset();
      await trpc.getPetById.invalidate();
    },
  });

  const deletePetMutation = api.pet.deletePetById.useMutation({
    onSuccess: () => {
      router.push('/animals');
    },
  });

  const deleteAnimal = async (animalId: string) => {
    await deletePetMutation.mutateAsync(animalId);
  };

  const form = useForm<IPetFullDetails>({
    resolver: zodResolver(fullPetDetailsSchema),
    defaultValues: {
      ...pet,
      dateOfBirth: pet?.dateOfBirth?.toISOString().split('T')[0],
      intakeEventDate: pet?.intakeEventDate?.toISOString().split('T')[0],
      weight: pet?.weight?.toString(),
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
                value="adoption"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_adoption')}
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_documents')}
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
                value="notes"
                className="w-1/2 sm:w-1/6"
              >
                {t('tabs_notes')}
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
                      <div className="items-center justify-center space-y-4 md:z-10 md:mt-10">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              setAvatarUrl(res[0]?.fileUrl as string);
                              form.setValue('image', res[0]?.fileUrl as string);
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
                          Remove Image
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
                              className="border-b-2 border-t-0 border-l-0 border-r-0"
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
                    <div className="col-span-6 mt-2 flex flex-col gap-3 md:flex-row">
                      <Button
                        type="submit"
                        className="justify-self-start"
                        size="lg"
                        disabled={!form.formState.isDirty}
                      >
                        Update {pet.name}&apos;s details
                      </Button>
                      <Button
                        className="justify-self-start"
                        size="lg"
                        onClick={() => deleteAnimal(pet.id)}
                        variant={'destructive'}
                      >
                        {t('pet_details_form_delete_button')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="adoption"></TabsContent>
              <TabsContent value="documents"></TabsContent>
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
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
                        >
                          <FormField
                            control={form.control}
                            name="intakeEventType"
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
                            name="intakeEventDate"
                            render={({ field }) => (
                              <FormItem className="col-span-6 sm:col-span-3">
                                <FormLabel>
                                  {t('add_pet_form_label_outcome_date')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="border-b-2 border-t-0 border-l-0 border-r-0"
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
                              disabled={!form.formState.isDirty}
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
                                  className="border-b-2 border-t-0 border-l-0 border-r-0"
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
              <TabsContent value="medical"></TabsContent>
              <TabsContent value="notes"></TabsContent>
            </div>
          </div>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default PetDetailsForm;
