import HeadMeta from 'src/components/utils/head-seo/HeadMeta';
import DashboardHeader from '../../navigation/header/DashboardHeader';

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
    <div className="overflow-x-hidden bg-neutral-50/30">
      <HeadMeta
        title={
          'podopieczni - Pomoc w zarządzaniu danymi zwierząt i procesie adopcji.'
        }
        description={
          'Promuj zwierzęta gotowe do adopcji i zarządzaj danymi podopiecznych z Twojego schroniska w ekologiczny i prosty sposób.'
        }
        keywords={'psy, koty, adopcja zwierząt, schroniska'}
        type={'website'}
        url={
          process.env.NEXT_PUBLIC_BASE_URL ??
          'https://podopieczni-dev.vercel.app'
        }
      />
      <div
        {...divProps}
        className={`mx-auto flex h-screen w-full flex-col ${justify}`}
      >
        <div className="w-full bg-neutral-0">
          <DashboardHeader />
        </div>
        <main className="flex w-full flex-grow flex-col">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
