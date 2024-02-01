import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';

const NoFavoritesYet = () => {
  const { t } = useTranslation('common');
  const [isLikeClicked, setIsLikeClicked] = useState(false);

  const handleFakeLikeClick = () => {
    setIsLikeClicked((prev) => !prev);
  };

  return (
    <div className="container flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="p-3 text-4xl font-medium leading-[3rem] text-foreground sm:mb-2 sm:text-5xl sm:leading-[5.5rem] md:text-6xl lg:text-[3.5rem] xl:text-[4rem] 2xl:text-[4.5rem]">
        {t('no_favorites_yet')}
      </h1>
      <p className="px-4">{t('no_favorites_description')}</p>
      <Icons.heart
        onClick={handleFakeLikeClick}
        className={`cursor-pointer transition-all ease-in-out hover:scale-110 ${
          isLikeClicked ? 'fill-primary-300 text-primary-300' : ''
        }`}
      />

      <div className="flex w-[19.5rem] flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
        <Button variant="roundedButton">
          <Link href="/search?search=dog">{t('footer_find_dogs')}</Link>
        </Button>
        <Button variant="roundedButton">
          <Link href="/search?search=cat">{t('footer_find_cats')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NoFavoritesYet;
