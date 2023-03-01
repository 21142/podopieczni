import type { NextPage } from "next";
import TextInput from "src/components/inputs/text/TextInput";
import DashboardLayout from "src/components/layouts/dashboard/DashboardLayout";
import Blob from "src/components/utils/blob/Blob";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const getAllUsers = api.user.getAllUsers.useQuery();

  const allUsers = JSON.stringify(getAllUsers.data, null, 2);

  return (
    <DashboardLayout>
      <div className="bg- 2xl:max-w-8xl mx-auto w-full max-w-7xl pt-5">
        <div className="mt-10 sm:mt-0">
          <div className="m-5 md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:col-span-3 md:mt-0">
              <div className="relative">
                <Blob
                  bgColor={"bg-primary-50"}
                  positionX={"top-0"}
                  positionY={"-left-4"}
                />
                <Blob
                  bgColor={"bg-purple-300"}
                  positionX={"top-0"}
                  positionY={"-right-4"}
                  animationDelay={"animation-delay-2"}
                />
                <Blob
                  bgColor={"bg-indigo-300"}
                  positionX={"-bottom-8"}
                  positionY={"left-20"}
                  animationDelay={"animation-delay-4"}
                />
              </div>
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
                  <button className="bg-primary-400/90 hover:bg-primary-400 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Save details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <pre>{allUsers}</pre>
    </DashboardLayout>
  );
};

export default Dashboard;
