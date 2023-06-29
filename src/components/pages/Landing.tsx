import { ChevronDoubleDownIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import FeaturedPets from '~/components/utility/FeaturedPets';
import GlobalStatistics, {
  type IGlobalStatistics,
} from '~/components/utility/GlobalStatistics';
import Hero from '~/components/utility/Hero';
import SearchByBreed from '~/components/utility/SearchByBreed';
import SearchByState from '~/components/utility/SearchByState';

const mock: IGlobalStatistics = {
  adopted: 222,
  waiting: 111,
  shelters: 31,
};

const Landing: React.FC = () => {
  return (
    <>
      <Hero />

      <div className="mt-10 flex flex-col items-center justify-center pt-12 text-center">
        <h1 className="p-2 text-3xl font-extrabold leading-[1.25] text-foreground sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4.5rem]">
          Szukaj <span className="text-primary-300">podopiecznych</span>,
          <br /> do których pasujesz.
        </h1>
        <h2 className="text-md mb-3 p-2 font-bold text-muted-foreground sm:mb-10 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
          Pomoc w adopcji i zarządzaniu danymi zwierząt.
        </h2>

        <Link
          href="#featured"
          scroll={false}
          aria-label="Przewiń w dół"
        >
          <ChevronDoubleDownIcon className="duration-50 h-8 cursor-pointer text-primary-300 transition-transform ease-in-out hover:scale-95" />
        </Link>

        <FeaturedPets />
        <GlobalStatistics {...mock} />
        <SearchByBreed />
        <SearchByState />
      </div>
    </>
  );
};

export default Landing;
