import Image from 'next/image';
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
      <div className="absolute top-2/3 left-1/2 -translate-x-48 w-full">
        <Search />
      </div>
    </div>
  );
};

export default Hero;
