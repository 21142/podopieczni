import Hero from 'src/components/utils/hero/Hero';
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
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
            pod<span className="text-primary-300">opieczni</span>
          </h1>
          <p className="text-2xl text-gray-700">made with</p>
          <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-3 lg:w-2/3">
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
