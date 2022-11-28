import SelectInput from '../inputs/select/SelectInput';
import TextInput from '../inputs/text/TextInput';

type FormProps = {
  formAction: string;
};

const Form = ({ formAction }: FormProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
      <div className="mt-10 sm:mt-0">
        <div className="m-5 md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form
              action={formAction}
              method="POST"
            >
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <p className="mb-4 text-2xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    Your personal details
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

                    <TextInput
                      divStyles="col-span-6"
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

      <div>
        <div className="m-5 md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form
              action="#"
              method="POST"
            >
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <p className="mb-4 text-2xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    Your profile
                  </p>

                  <div className="grid grid-cols-6 gap-6">
                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Name"
                      inputName="name"
                      inputId="name"
                    />

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        autoComplete="country-name"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>Please select</option>
                        <option>Admin</option>
                        <option>Shelter</option>
                        <option>Adopting</option>
                      </select>
                    </div>

                    <TextInput
                      divStyles="col-span-6"
                      label="Description"
                      inputName="description"
                      inputId="description"
                    />

                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Photo
                      </label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        <button
                          type="button"
                          className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Cover photo
                      </label>
                      <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 hover:text-primary-400"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SelectInput
                  value={''}
                  initial={'Please select'}
                  options={[{ id: '1', value: 'OPTION 1', disabled: false }]}
                />

                <div className="bg-neutral-0 px-4 py-3 text-left sm:px-6 sm:py-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-400/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save profile
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

export default Form;
