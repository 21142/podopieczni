import PageLayout from '../components/layouts/primary/PageLayout';
import { NextPageWithLayout } from './page';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPageWithLayout = () => {
  return (
    <>
      <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
        pod<span className="text-purple-300">opieczni</span>
      </h1>
      <p className="text-2xl text-gray-700">made with</p>
      <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-3 lg:w-2/3">
        <TechnologyCard
          name="NextJS"
          description="The React framework for production"
          documentation="https://nextjs.org/"
        />
        <TechnologyCard
          name="TypeScript"
          description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale"
          documentation="https://www.typescriptlang.org/"
        />
        <TechnologyCard
          name="TailwindCSS"
          description="Rapidly build modern websites without ever leaving your HTML"
          documentation="https://tailwindcss.com/"
        />
      </div>
    </>
  );
};

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
        href={documentation}
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
