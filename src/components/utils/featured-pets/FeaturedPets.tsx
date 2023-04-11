import { useQuery } from '@tanstack/react-query';
import Spinner from 'src/components/spinner/Spinner';
import PetsGrid from '../pets-grid/PetsGrid';
import type IAnimalData from '../search-results/types';

export interface IFeaturedPets {
  featuredAnimals?: IAnimalData[];
}

const animalFetcher = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const petfindetAnimalsData = (await fetch(`${baseUrl}/api/animals`).then(
    (res) => res.json()
  )) as IAnimalData[] | undefined;

  if (!petfindetAnimalsData) return;
  const featuredAnimalsData = petfindetAnimalsData.slice(10, 16);
  return featuredAnimalsData;
};

const FeaturedPets: React.FC<IFeaturedPets> = () => {
  const { data: featuredAnimals, isLoading } = useQuery(
    ['animals'],
    animalFetcher
  );

  return (
    <>
      <div
        id="featured"
        className="aspect-[10/1]"
      >
        <svg
          id="visual"
          viewBox="0 0 3840 384"
          width="3840"
          height="384"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <path
            d="M0 193L53.3 201.2C106.7 209.3 213.3 225.7 320 230.3C426.7 235 533.3 228 640 220.5C746.7 213 853.3 205 960 199.8C1066.7 194.7 1173.3 192.3 1280 191.8C1386.7 191.3 1493.3 192.7 1600 201.7C1706.7 210.7 1813.3 227.3 1920 229.3C2026.7 231.3 2133.3 218.7 2240 215.2C2346.7 211.7 2453.3 217.3 2560 216.7C2666.7 216 2773.3 209 2880 211.3C2986.7 213.7 3093.3 225.3 3200 227C3306.7 228.7 3413.3 220.3 3520 218.7C3626.7 217 3733.3 222 3786.7 224.5L3840 227L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#e6a6ed"
          ></path>
          <path
            d="M0 260L53.3 262.2C106.7 264.3 213.3 268.7 320 274.3C426.7 280 533.3 287 640 287.8C746.7 288.7 853.3 283.3 960 273.5C1066.7 263.7 1173.3 249.3 1280 252C1386.7 254.7 1493.3 274.3 1600 283.3C1706.7 292.3 1813.3 290.7 1920 286.2C2026.7 281.7 2133.3 274.3 2240 265.7C2346.7 257 2453.3 247 2560 245.5C2666.7 244 2773.3 251 2880 259C2986.7 267 3093.3 276 3200 281C3306.7 286 3413.3 287 3520 288.5C3626.7 290 3733.3 292 3786.7 293L3840 294L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#dc80e6"
          ></path>
          <path
            d="M0 300L53.3 298.5C106.7 297 213.3 294 320 291.3C426.7 288.7 533.3 286.3 640 283.5C746.7 280.7 853.3 277.3 960 284C1066.7 290.7 1173.3 307.3 1280 312.5C1386.7 317.7 1493.3 311.3 1600 310.8C1706.7 310.3 1813.3 315.7 1920 318.3C2026.7 321 2133.3 321 2240 317.3C2346.7 313.7 2453.3 306.3 2560 298.5C2666.7 290.7 2773.3 282.3 2880 278C2986.7 273.7 3093.3 273.3 3200 278.3C3306.7 283.3 3413.3 293.7 3520 301.7C3626.7 309.7 3733.3 315.3 3786.7 318.2L3840 321L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#d155de"
          ></path>
          <path
            d="M0 356L53.3 353C106.7 350 213.3 344 320 339.2C426.7 334.3 533.3 330.7 640 333.5C746.7 336.3 853.3 345.7 960 346.3C1066.7 347 1173.3 339 1280 333C1386.7 327 1493.3 323 1600 323.8C1706.7 324.7 1813.3 330.3 1920 332.8C2026.7 335.3 2133.3 334.7 2240 336.2C2346.7 337.7 2453.3 341.3 2560 339.7C2666.7 338 2773.3 331 2880 326.3C2986.7 321.7 3093.3 319.3 3200 323C3306.7 326.7 3413.3 336.3 3520 341.7C3626.7 347 3733.3 348 3786.7 348.5L3840 349L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#c505d6"
          ></path>
        </svg>
      </div>
      <div className="flex min-h-[84rem] w-full flex-col items-center justify-start bg-primary-200">
        <p className="py-10 text-3xl font-bold text-neutral-50 sm:text-4xl md:py-10 md:text-5xl lg:text-6xl 2xl:text-7xl">
          Podopieczni szukający domu
        </p>
        {isLoading ? (
          <Spinner />
        ) : (
          <PetsGrid featuredAnimals={featuredAnimals ?? []} />
        )}
      </div>
      <div className="aspect-[10/1] rotate-180">
        <svg
          id="visual"
          viewBox="0 0 3840 384"
          width="3840"
          height="384"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <path
            d="M0 193L53.3 201.2C106.7 209.3 213.3 225.7 320 230.3C426.7 235 533.3 228 640 220.5C746.7 213 853.3 205 960 199.8C1066.7 194.7 1173.3 192.3 1280 191.8C1386.7 191.3 1493.3 192.7 1600 201.7C1706.7 210.7 1813.3 227.3 1920 229.3C2026.7 231.3 2133.3 218.7 2240 215.2C2346.7 211.7 2453.3 217.3 2560 216.7C2666.7 216 2773.3 209 2880 211.3C2986.7 213.7 3093.3 225.3 3200 227C3306.7 228.7 3413.3 220.3 3520 218.7C3626.7 217 3733.3 222 3786.7 224.5L3840 227L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#e6a6ed"
          ></path>
          <path
            d="M0 260L53.3 262.2C106.7 264.3 213.3 268.7 320 274.3C426.7 280 533.3 287 640 287.8C746.7 288.7 853.3 283.3 960 273.5C1066.7 263.7 1173.3 249.3 1280 252C1386.7 254.7 1493.3 274.3 1600 283.3C1706.7 292.3 1813.3 290.7 1920 286.2C2026.7 281.7 2133.3 274.3 2240 265.7C2346.7 257 2453.3 247 2560 245.5C2666.7 244 2773.3 251 2880 259C2986.7 267 3093.3 276 3200 281C3306.7 286 3413.3 287 3520 288.5C3626.7 290 3733.3 292 3786.7 293L3840 294L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#dc80e6"
          ></path>
          <path
            d="M0 300L53.3 298.5C106.7 297 213.3 294 320 291.3C426.7 288.7 533.3 286.3 640 283.5C746.7 280.7 853.3 277.3 960 284C1066.7 290.7 1173.3 307.3 1280 312.5C1386.7 317.7 1493.3 311.3 1600 310.8C1706.7 310.3 1813.3 315.7 1920 318.3C2026.7 321 2133.3 321 2240 317.3C2346.7 313.7 2453.3 306.3 2560 298.5C2666.7 290.7 2773.3 282.3 2880 278C2986.7 273.7 3093.3 273.3 3200 278.3C3306.7 283.3 3413.3 293.7 3520 301.7C3626.7 309.7 3733.3 315.3 3786.7 318.2L3840 321L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#d155de"
          ></path>
          <path
            d="M0 356L53.3 353C106.7 350 213.3 344 320 339.2C426.7 334.3 533.3 330.7 640 333.5C746.7 336.3 853.3 345.7 960 346.3C1066.7 347 1173.3 339 1280 333C1386.7 327 1493.3 323 1600 323.8C1706.7 324.7 1813.3 330.3 1920 332.8C2026.7 335.3 2133.3 334.7 2240 336.2C2346.7 337.7 2453.3 341.3 2560 339.7C2666.7 338 2773.3 331 2880 326.3C2986.7 321.7 3093.3 319.3 3200 323C3306.7 326.7 3413.3 336.3 3520 341.7C3626.7 347 3733.3 348 3786.7 348.5L3840 349L3840 385L3786.7 385C3733.3 385 3626.7 385 3520 385C3413.3 385 3306.7 385 3200 385C3093.3 385 2986.7 385 2880 385C2773.3 385 2666.7 385 2560 385C2453.3 385 2346.7 385 2240 385C2133.3 385 2026.7 385 1920 385C1813.3 385 1706.7 385 1600 385C1493.3 385 1386.7 385 1280 385C1173.3 385 1066.7 385 960 385C853.3 385 746.7 385 640 385C533.3 385 426.7 385 320 385C213.3 385 106.7 385 53.3 385L0 385Z"
            fill="#c505d6"
          ></path>
        </svg>
      </div>
    </>
  );
};

export default FeaturedPets;
