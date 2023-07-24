import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ZodError, type z } from 'zod';
import { api } from '~/lib/api';
import { useToast } from '~/lib/use-toast';
import { cn } from '~/lib/utils';
import {
  petDetailsSchema,
  type IPetDetails,
} from '~/lib/validators/petValidation';
import { Button, buttonVariants } from '../primitives/Button';
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
  OTHER: 'Other',
};

const AddPetForm = () => {
  const trpc = api.useContext().pet;
  const { toast } = useToast();
  const router = useRouter();

  const addPetMutation = api.pet.add.useMutation({
    onSuccess: async () => {
      await trpc.getAllPets.invalidate();
      form.reset();
      router.push('/pets');
    },
  });

  const form = useForm<IPetDetails>({
    resolver: zodResolver(petDetailsSchema),
  });

  const onSubmit = async (values: IPetDetails) => {
    try {
      await addPetMutation.mutateAsync(values);
      toast({
        description: `${values.name} successfully added!`,
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
    <div className="p-4">
      <Card className="mx-auto w-full max-w-7xl p-4 px-4 py-5 sm:mt-10 sm:p-6 2xl:max-w-8xl">
        <p className="mb-4 text-2xl font-light tracking-widest text-foreground underline decoration-2 underline-offset-2 sm:text-4xl">
          Register a new pet
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6 md:grid md:grid-cols-6 md:gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-6 sm:col-span-3">
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Identifier</FormLabel>
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
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
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
                  <FormLabel>Coat</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coat" />
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
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
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
                  <FormLabel>Weight</FormLabel>
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
                  <FormLabel>Species</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
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
                  <FormLabel>Breed</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select breed" />
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
                  <FormLabel>Microchip number</FormLabel>
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
                  <FormLabel>Microchip brand</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
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
                  <FormLabel>Intake date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
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
                  <FormLabel>Intake type</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intake type" />
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
                  <FormLabel>Health condition on arrival</FormLabel>
                  <Select
                    onValueChange={field.onChange as (value: string) => void}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
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
                      <SelectItem value="healthy">Healthy</SelectItem>
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
                onClick={async () => await trpc.getAllPets.invalidate()}
                disabled={addPetMutation.isLoading}
              >
                {addPetMutation.isLoading ? 'Ładowanie...' : 'Zapisz'}
              </Button>
              <Button
                type="submit"
                className={`${cn(
                  buttonVariants({ variant: 'secondary' })
                )} justify-self-start`}
                onClick={async () => await trpc.getAllPets.invalidate()}
                disabled={addPetMutation.isLoading}
              >
                {addPetMutation.isLoading
                  ? 'Ładowanie...'
                  : 'Zapisz i dodaj kolejne'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddPetForm;
