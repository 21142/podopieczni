import { useRouter } from 'next/navigation';
import { Button } from '../primitives/Button';

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="grid h-[50vh] content-center">
      <p className="p-12 text-center">
        You don&apos;t have permission to access this page
      </p>
      <div className="flex justify-center gap-5">
        <Button
          variant="primary"
          size="lg"
          onClick={() => void router.push('/')}
        >
          Strona główna
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
