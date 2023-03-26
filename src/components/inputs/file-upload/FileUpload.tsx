import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import Image from 'next/image';

const FileUpload: React.FC = () => {
  return (
    <>
      <div className="col-span-2 md:col-span-3">
        <label className="block text-sm font-light uppercase tracking-[0.15rem] text-primary-400">
          Photo
        </label>
        <div className="flex h-full items-center justify-center gap-2 pb-6 md:gap-8">
          <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100 sm:h-14 sm:w-14 md:h-20 md:w-20 lg:h-32 lg:w-32">
            <Image
              src={'/no-profile-picture.svg'}
              className="min-h-full min-w-full opacity-60"
              alt="animal profile picture"
              width="800"
              height="800"
            />
          </span>
          <CvaButton
            variant="primary"
            size="small"
            className="w-42 rounded-md"
            type="submit"
          >
            Save
          </CvaButton>
        </div>
      </div>
      <div className="col-span-4 md:col-span-3">
        <label className="block text-sm font-light uppercase tracking-[0.15rem] text-primary-400">
          Cover photo
        </label>
        <div className="mt-5 flex h-48 justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="grid content-center space-y-1 text-center">
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
                <span>Choose a file to upload</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop here</p>
            </div>
            <p className="text-xs text-gray-500">PNG or JPG up to 10MB</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
