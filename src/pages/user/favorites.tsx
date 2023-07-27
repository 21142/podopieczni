import type { NextPage } from 'next';
import Button from '~/components/buttons/base/Button';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';

const Favorites: NextPage = () => {
  return (
    <PageLayout>
      <div className="container flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="p-2 text-3xl font-medium leading-10 text-foreground sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4.5rem]">
          No favorites yet
        </h1>
        <p>
          When you find a pet you love, add it to your favorites list by tapping
          the heart icon on the pet&apos;s profile.
        </p>
        <Icons.heart className="h-6 w-6 fill-none text-primary-400 hover:fill-current" />

        <div className="flex w-[19.5rem] flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
          <Button
            text="Szukam psa"
            href="/search?search=dog"
          />
          <Button
            text="Szukam kota"
            href="/search?search=cat"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Favorites;
