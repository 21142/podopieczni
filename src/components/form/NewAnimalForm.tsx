import { CvaButton } from '../buttons/cva/ButtonCva';
import FileUpload from '../inputs/file-upload/FileUpload';
import TextInput from '../inputs/text/TextInput';

type FormProps = {
  formAction: string;
  title: string;
};

const NewAnimalForm: React.FC<FormProps> = ({ formAction, title }) => {
  return (
    <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
      <div className="mt-10 sm:mt-0">
        <div className="m-5 md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-3 md:mt-0">
            <form
              action={formAction}
              method="POST"
            >
              <div className="overflow-hidden shadow-md sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <p className="mb-4 text-2xl font-light tracking-widest text-neutral-800 underline decoration-2 underline-offset-2 sm:text-4xl">
                    {title}
                  </p>
                  <div className="grid grid-cols-6 gap-6">
                    <FileUpload />
                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Name"
                      inputName="name"
                      inputId="name"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Identifier"
                      inputName="id"
                      inputId="id"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Status"
                      inputName="status"
                      inputId="status"
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
                      label="Gender"
                      inputName="gender"
                      inputId="gender"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Altered"
                      inputName="altered"
                      inputId="altered"
                    />

                    <TextInput
                      divStyles="col-span-3"
                      label="Weight"
                      inputName="weight"
                      inputId="weight"
                    />

                    <div className="col-span-3"></div>
                    <div className="col-span-6 h-14"></div>

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Spiecies"
                      inputName="spieces"
                      inputId="spieces"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Breed"
                      inputName="breed"
                      inputId="breed"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Microchip number"
                      inputName="microchip-number"
                      inputId="microchip-number"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Microchip brand"
                      inputName="microchip-brand"
                      inputId="microchip-brand"
                    />

                    <div className="col-span-6 h-14"></div>
                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Intake date"
                      inputName="intake-date"
                      inputId="intake-date"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Intake type"
                      inputName="intake-type"
                      inputId="intake-type"
                    />

                    <TextInput
                      divStyles="col-span-6 sm:col-span-3"
                      label="Condition on arrival"
                      inputName="condition"
                      inputId="condition"
                    />
                  </div>
                </div>

                <div className="flex gap-x-4 bg-neutral-0 px-4 py-3 text-left sm:px-6 sm:py-6">
                  <CvaButton
                    variant="primary"
                    size="medium"
                    className="w-42 rounded-md"
                    type="submit"
                  >
                    Save details
                  </CvaButton>
                  <CvaButton
                    variant="primary"
                    size="medium"
                    className="w-42 rounded-md"
                    type="submit"
                  >
                    Save and add another
                  </CvaButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAnimalForm;
