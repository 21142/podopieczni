import Image from 'next/image';
import Button from 'src/components/buttons/base/Button';
import hero from '../../../../public/images/hero.png';
import Search from '../../../components/inputs/search/Search';

export interface IHero {}

const Hero: React.FC<IHero> = () => {
  return (
    <div className="relative w-full h-[19rem] lg:h-[20rem] xl:h-[21rem] 2xl:h-[22rem]">
      <Image
        src={hero}
        layout="fill"
        objectFit="cover"
        alt="hero image section"
      />
      <div className="flex flex-col text-center items-center justify-center absolute top-[71%] left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm h-[10.75rem] w-[90%] sm:max-w-[34rem] rounded-2xl shadow-lg">
        <Search />
        <div className="pt-3 flex items-center justify-center gap-x-5 w-[19.5rem]">
          <Button text="Psy" />
          <Button text="Koty" />
          <Button text="Schroniska" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
