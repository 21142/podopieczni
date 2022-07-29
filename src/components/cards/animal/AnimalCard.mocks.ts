import { IAnimalCard } from './AnimalCard';

const base: IAnimalCard = {
  tag: 'Felines',
  title: `What's new in Cats`,
  body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea atque quidem!',
  author: 'Alex',
  time: '2h ago',
};

export const mockAnimalCardProps = {
  base,
};
