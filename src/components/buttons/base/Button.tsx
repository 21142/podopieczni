export interface IButton {
  text: string;
}

const Button: React.FC<IButton> = ({ text }) => {
  return (
    <h3 className="cursor-pointer rounded-full border border-primary-300 py-1 px-4 text-primary-300 transition-colors duration-200 ease-in-out hover:bg-primary-300 hover:text-white">
      {text}
    </h3>
  );
};

export default Button;
