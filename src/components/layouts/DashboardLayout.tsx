import HeadMeta from '~/components/utility/HeadMeta';
import { env } from '~/env.mjs';
import DashboardHeader from '../navigations/DashboardHeader';

export interface IDashboardLayout
  extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start' | 'items-end';
}

const DashboardLayout: React.FC<IDashboardLayout> = ({
  children,
  justify = 'items-center',
  ...divProps
}) => {
  return (
    <div className="overflow-x-hidden">
      <HeadMeta
        title={
          'podopieczni - Pomoc w zarządzaniu danymi zwierząt i procesie adopcji.'
        }
        description={
          'Promuj zwierzęta gotowe do adopcji i zarządzaj danymi podopiecznych z Twojego schroniska w ekologiczny i prosty sposób.'
        }
        keywords={'psy, koty, adopcja zwierząt, schroniska'}
        type={'website'}
        url={env.NEXT_PUBLIC_BASE_URL ?? 'https://podopieczni-dev.vercel.app'}
      />
      <div
        {...divProps}
        className={`mx-auto flex h-screen w-full flex-col ${justify}`}
      >
        <div className="w-full">
          <DashboardHeader />
        </div>
        <main className="flex w-full flex-grow flex-col font-sans">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
