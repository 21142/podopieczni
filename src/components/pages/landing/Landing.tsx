import { ChevronDoubleDownIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import FeaturedPets from 'src/components/utils/featured-pets/FeaturedPets';
import Hero from 'src/components/utils/hero/Hero';
import SearchByBreed from 'src/components/utils/search-by-breed/SearchByBreed';
import SearchByState from 'src/components/utils/search-by-state/SearchByState';
import GlobalStatistics from 'src/components/utils/statistics/GlobalStatistics';
import { mockGlobalStatisticsProps } from 'src/components/utils/statistics/GlobalStatistics.mocks';

export interface ILanding {}

const Landing: React.FC<ILanding> = () => {
  return (
    <>
      <Hero />

      <div className="flex flex-col text-center items-center justify-center mt-10 pt-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4.5rem] p-2 leading-[1.25] font-extrabold text-neutral-800">
          Szukaj <span className="text-primary-300">podopiecznych</span>,
          <br /> do których pasujesz.
        </h1>
        <h2 className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl p-2 font-bold text-neutral-600 mb-3 sm:mb-10">
          Pomoc w adopcji i zarządzaniu danymi zwierząt.
        </h2>

        <Link href="#featured">
          <ChevronDoubleDownIcon className="h-8 hover:scale-95 transition-transform duration-50 ease-in-out text-primary-300 cursor-pointer" />
        </Link>

        <FeaturedPets />
        <GlobalStatistics {...mockGlobalStatisticsProps.base} />
        <SearchByBreed />
        <SearchByState />
      </div>
    </>
  );
};

export default Landing;
