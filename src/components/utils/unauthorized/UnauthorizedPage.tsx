import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';

const UnauthorizedPage: FC = ({}) => {
  const router = useRouter();
  return (
    <div className="grid h-[50vh] content-center">
      <p className="p-12 text-center">
        You don&apos;t have permission to access this page
      </p>
      <div className="flex justify-center gap-5">
        <CvaButton
          variant="primary"
          className="w-36 rounded-md"
          onClick={() => void router.push('/')}
        >
          Strona główna
        </CvaButton>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
