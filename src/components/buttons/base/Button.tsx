export interface IButton {
  text: string;
}

const Button: React.FC<IButton> = ({ text }) => {
  return (
    <h3 className="text-primary-300 border border-primary-300 rounded-full py-1 px-4 hover:text-white hover:bg-primary-300 transition duration-200 ease-in-out cursor-pointer">
      {text}
    </h3>
  );
};

export default Button;
