import { links } from '~/config/siteConfig';
import { Icons } from '../icons/Icons';

type Props = {
  organizationAddress: string;
  organizationPhone: string | null;
  organizationEmail: string | null;
};

const ShelterContactDetails = ({
  organizationAddress,
  organizationPhone,
  organizationEmail,
}: Props) => {
  return (
    <section className="flex flex-col items-start justify-center gap-4">
      <div className="flex space-x-4">
        <Icons.map className="h-6 w-6" />
        <p>{organizationAddress}</p>
      </div>
      {organizationPhone && (
        <div className="mt-2 flex items-center space-x-4">
          <Icons.phone className="h-6 w-6" />
          <a
            className="bg-transparent text-neutral-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-neutral-100 dark:hover:bg-transparent"
            href={links.phone(organizationPhone)}
          >
            {organizationPhone}
          </a>
        </div>
      )}
      {organizationEmail && (
        <div className="mt-2 flex items-center space-x-4">
          <Icons.mail className="h-6 w-6" />
          <a
            href={links.email(organizationEmail)}
            className="bg-transparent text-neutral-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-neutral-100 dark:hover:bg-transparent"
          >
            {organizationEmail}
          </a>
        </div>
      )}
    </section>
  );
};

export default ShelterContactDetails;
