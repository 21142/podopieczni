type Props = {
  bgColor: string;
  positionX: string;
  positionY: string;
  animationDelay?: string;
};

const Blob = ({ bgColor, positionX, positionY, animationDelay }: Props) => {
  return (
    <div
      className={`absolute ${positionX} ${positionY} h-80 w-80 animate-blob rounded-full ${bgColor} opacity-60 mix-blend-multiply blur-xl filter ${
        animationDelay ? animationDelay : ''
      }`}
    ></div>
  );
};

export default Blob;
