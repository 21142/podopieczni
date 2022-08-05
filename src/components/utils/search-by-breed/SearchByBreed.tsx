import HeaderLink from "src/components/links/header/HeaderLink";

export interface ISearchByBreed {
}

const SearchByBreed: React.FC<ISearchByBreed> = () => {
  return (
    <div className="mt-[10rem] md:mt-[15rem] lg:mt-[18rem] xl:mt-[22rem] 2xl:mt-[25rem]">

      <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-neutral-700 mb-5">Szukaj podopiecznych po <span className="text-primary-300 font-bold">rasie</span></p>
      <div className="grid gap-10 md:gap-14 xl:gap-20 pt-5 md:pt-10 text-center content-center grid-cols-2 sm:grid-cols-3 lg:w-full">
        <HeaderLink href="/search/breed/bulldog" title="Bulldog" />
        <HeaderLink href="/search/breed/pudel" title="Pudel" />
        <HeaderLink href="/search/breed/cockerspaniel" title="Cocker spaniel" />
        <HeaderLink href="/search/breed/labrador" title="Labrador" />
        <HeaderLink href="/search/breed/goldenretriever" title="Golden Retriever" />
        <HeaderLink href="/search/breed/chihuahua" title="Chihuahua" />
        <HeaderLink href="/search/breed/owczarekniemiecki" title="Owczarek niemiecki" />
        <HeaderLink href="/search/breed/yorkshireterrier" title="Yorkshire Terrier" />
        <HeaderLink href="/search/breed/doberman" title="Doberman" />
        <HeaderLink href="/search/breed/owczarekniemiecki" title="Owczarek niemiecki" />
        <HeaderLink href="/search/breed/yorkshireterrier" title="Yorkshire Terrier" />
        <HeaderLink href="/search/breed/doberman" title="Doberman" />
      </div>
    </div>
  )
};

export default SearchByBreed;
