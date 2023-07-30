import type { NextPage } from 'next';
import Link from 'next/link';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';

const Favorites: NextPage = () => {
  return (
    <PageLayout>
      <div className="container flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="p-2 text-4xl font-medium leading-10 text-foreground sm:mb-2 sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem] 2xl:text-[4.5rem]">
          No favorites yet
        </h1>
        <p>
          When you find a pet you love, add it to your favorites list by tapping
          the heart icon on the pet&apos;s profile.
        </p>
        <Icons.heart className="h-6 w-6 fill-none text-primary-400 hover:fill-current" />

        <div className="flex w-[19.5rem] flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
          <Button variant="roundedButton">
            <Link href="/search?search=dog">Szukam psa</Link>
          </Button>
          <Button variant="roundedButton">
            <Link href="/search?search=cat">Szukam kota</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Favorites;
