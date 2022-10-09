export interface ISpinner {}

const Spinner: React.FC<ISpinner> = () => {
  return (
    <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 ">
      <div className="border-solid animate-spinner rounded-full border-neutral-50 border-8 h-32 w-32"></div>
    </div>
  );
};

export default Spinner;
