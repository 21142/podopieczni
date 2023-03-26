export interface IGlobalStatistics {
  adopted: number;
  waiting: number;
  shelters: number;
}

const GlobalStatistics: React.FC<IGlobalStatistics> = ({
  adopted,
  waiting,
  shelters,
}) => {
  return (
    <div className="flex min-h-[80%] items-center justify-center gap-[1rem] sm:gap-[3rem] md:gap-[5rem]">
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-800 sm:text-2xl md:text-4xl">
          {adopted}
        </p>
        <p className="text-md font-light text-neutral-600 sm:text-lg md:text-2xl">
          Zaadoptowanych
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-800 sm:text-2xl md:text-4xl">
          {waiting}
        </p>
        <p className="text-md font-light text-neutral-600 sm:text-lg md:text-2xl">
          Czeka na dom
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-800 sm:text-2xl md:text-4xl">
          {shelters}
        </p>
        <p className="text-md font-light text-neutral-600 sm:text-lg md:text-2xl">
          Schronisk
        </p>
      </div>
    </div>
  );
};

export default GlobalStatistics;
