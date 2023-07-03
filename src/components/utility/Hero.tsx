import Image from 'next/image';
import Button from 'src/components/buttons/base/Button';
import { TypeOfResults } from '~/lib/constants';
import Search from '../inputs/Search';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[19rem] w-full lg:h-[20rem] xl:h-[21rem] 2xl:h-[22rem]">
      <Image
        src="https://i.postimg.cc/7Y7Lk3S8/hero.png"
        fill
        className="object-cover"
        alt="hero image section"
        loading="eager"
        priority
      />
      <div className="absolute top-[58%] left-1/2 flex h-[12.5rem] w-full -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-white/20 text-center shadow-lg backdrop-blur-sm dark:bg-white/10 xs:w-[90%] sm:max-w-[34rem] xl:top-[62%]">
        <h2 className="mb-3 text-lg font-bold text-neutral-50 dark:text-foreground sm:text-2xl">
          Szukaj dostępnych podopiecznych:
        </h2>
        <Search
          query={''}
          typeOfResults={TypeOfResults.Animal}
        />
        <div className="flex w-[19.5rem] items-center justify-center gap-x-5 pt-3">
          <Button
            text="Zwierzęta"
            href={`/${TypeOfResults.Animal}#scrollToPosition`}
          />
          <Button
            text="Schroniska"
            href={`/${TypeOfResults.Organization}#scrollToPosition`}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
