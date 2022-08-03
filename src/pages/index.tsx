import Hero from 'src/components/utils/hero/Hero';
import GlobalStatistics from 'src/components/utils/statistics/GlobalStatistics';
import { mockGlobalStatisticsProps } from 'src/components/utils/statistics/GlobalStatistics.mocks';
import PageLayout from '../components/layouts/primary/PageLayout';
import { NextPageWithLayout } from './page';

type TechnologyCardProps = {
  name: string;
  description: string;
  url: string;
};

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="w-full">
        <Hero />
        <div className="flex flex-col text-center items-center justify-center mt-10 py-12">
          <h1 className="text-5xl p-2 md:text-[4rem] leading-[1.25] font-extrabold text-neutral-800">
            Szukaj <span className="text-primary-300">podopiecznych</span>,
            <br /> do których pasujesz.
          </h1>
          <h2 className="text-md md:text-4xl p-2 mb-[15rem] font-bold text-neutral-600">
            Pomoc w adopcji i zarządzaniu danymi zwierząt.
          </h2>
          <GlobalStatistics {...mockGlobalStatisticsProps.base} />
          <div className="grid gap-3 pt-3 mt-[20rem] text-center md:grid-cols-3 lg:w-2/3">
            <TechnologyCard
              name="NextJS"
              description="The React framework for production"
              url="https://nextjs.org/"
            />
            <TechnologyCard
              name="TypeScript"
              description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale"
              url="https://www.typescriptlang.org/"
            />
            <TechnologyCard
              name="TailwindCSS"
              description="Rapidly build modern websites without ever leaving your HTML"
              url="https://tailwindcss.com/"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const TechnologyCard = ({ name, description, url }: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="mt-3 text-sm underline text-primary-300 decoration-dotted underline-offset-2"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>
    </section>
  );
};

Home.getLayout = (page) => {
  return <PageLayout>{page}</PageLayout>;
};

export default Home;
