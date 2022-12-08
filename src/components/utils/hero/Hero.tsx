import Image from 'next/image';
import Button from 'src/components/buttons/base/Button';
import Search from '../../../components/inputs/search/Search';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[19rem] w-full lg:h-[20rem] xl:h-[21rem] 2xl:h-[22rem]">
      <Image
        src="https://i.postimg.cc/7Y7Lk3S8/hero.png"
        layout="fill"
        objectFit="cover"
        alt="hero image section"
      />
      <div className="absolute top-[61%] left-1/2 flex h-[11.5rem] w-[90%] -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-white/20 text-center shadow-lg backdrop-blur-sm sm:max-w-[34rem] xl:top-[64%]">
        <h2 className="mb-2 text-lg font-bold text-neutral-50 sm:text-2xl">
          Wyszukaj zwierzę lub schronisko:
        </h2>
        <Search query={''} />
        <div className="flex w-[19.5rem] items-center justify-center gap-x-5 pt-3">
          <Button text="Psy" />
          <Button text="Koty" />
          <Button text="Schroniska" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
