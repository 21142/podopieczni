import SelectInput from '../inputs/select/SelectInput';
import TextInput from '../inputs/TextInput';

type FormProps = {
  title: string;
};

const ProfileForm = ({ title }: FormProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl 2xl:max-w-8xl">
      <div className="mt-10 sm:mt-0">
        <div className="m-5 md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form noValidate>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <p className="my-4 text-2xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    {title}
                  </p>

                  <div className="grid grid-cols-6 gap-6">
                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="First name"
                      inputName="first-name"
                      inputId="first-name"
                      autoComplete="given-name"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Last name"
                      inputName="last-name"
                      inputId="last-name"
                      autoComplete="family-name"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-4"
                      label="Email address"
                      inputName="email-address"
                      inputId="email-address"
                      autoComplete="email"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Date of birth"
                      inputName="bday"
                      inputId="bday"
                      autoComplete="bday"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Phone number"
                      inputName="tel"
                      inputId="tel"
                      autoComplete="tel"
                    />
                    <SelectInput />
                  </div>
                  <p className="col-span-6 mt-12 mb-4 text-2xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    Your address details
                  </p>
                  <div className="grid grid-cols-6 gap-6">
                    <TextInput
                      divStyles="col-span-6 sm:col-span-4"
                      label="Correspondence address"
                      inputName="street-address"
                      inputId="street-address"
                      autoComplete="street-address"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="City"
                      inputName="city"
                      inputId="city"
                      autoComplete="address-level2"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="State"
                      inputName="state"
                      inputId="state"
                      autoComplete="address-level1"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Postal code"
                      inputName="postal-code"
                      inputId="postal-code"
                      autoComplete="postal-code"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Country"
                      inputName="country-name"
                      inputId="country-name"
                      autoComplete="country-name"
                    />
                  </div>
                </div>
                <div className="bg-neutral-0 px-4 py-3 text-left sm:px-6 sm:py-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-400/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save details
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
