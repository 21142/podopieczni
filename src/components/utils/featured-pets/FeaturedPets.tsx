export interface IFeaturedPets {}

type TechnologyCardProps = {
  name: string;
  description: string;
  url: string;
};

const FeaturedPets: React.FC<IFeaturedPets> = () => {
  return (
    <>
      <div
        id="featured"
        className="aspect-[3/1] w-full bg-cover bg-no-repeat bg-center bg-opacity-80 bg-[url('/images/footer-wave.svg')]"
      ></div>
      <div className="bg-primary-200 w-full flex flex-col items-center justify-center">
        <p className="text-neutral-50 text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl p-3 font-bold">
          Podopieczni szukający domu
        </p>
        <div className="grid gap-3 p-5 md:grid-cols-3 lg:w-2/3">
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
      <div className="aspect-[3/1] rotate-180 w-full bg-cover bg-no-repeat bg-center bg-[url('/images/footer-wave.svg')]"></div>
    </>
  );
};

const TechnologyCard = ({ name, description, url }: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 bg-neutral-50/[70%] border-gray-500 rounded shadow-xl hover:scale-105">
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

export default FeaturedPets;
