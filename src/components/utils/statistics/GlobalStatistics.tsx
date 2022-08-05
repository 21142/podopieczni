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
    <div className="flex items-center justify-center gap-[1rem] sm:gap-[3rem] md:gap-[5rem]">
      <div>
        <p className="text-lg sm:text-2xl md:text-4xl font-semibold text-neutral-800">
          {adopted}
        </p>
        <p className="text-md sm:text-lg md:text-2xl font-light text-neutral-600">
          Zaadoptowanych
        </p>
      </div>
      <div>
        <p className="text-lg sm:text-2xl md:text-4xl font-semibold text-neutral-800">
          {waiting}
        </p>
        <p className="text-md sm:text-lg md:text-2xl font-light text-neutral-600">
          Czeka na dom
        </p>
      </div>
      <div>
        <p className="text-lg sm:text-2xl md:text-4xl font-semibold text-neutral-800">
          {shelters}
        </p>
        <p className="text-md sm:text-lg md:text-2xl font-light text-neutral-600">
          Schronisk
        </p>
      </div>
    </div>
  );
};

export default GlobalStatistics;
