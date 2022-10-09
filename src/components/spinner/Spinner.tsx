export interface ISpinner {}

const Spinner: React.FC<ISpinner> = () => {
  return (
    <div className="transform translate-x-1/2 translate-y-1/2 mr-28">
      <div className="border-solid animate-spinner rounded-full border-transparent border-8 h-32 w-32"></div>
    </div>
  );
};

export default Spinner;
