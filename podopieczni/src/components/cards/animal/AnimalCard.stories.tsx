import { ComponentMeta, ComponentStory } from '@storybook/react';
import AnimalCard, { IAnimalCard } from './AnimalCard';
import { mockAnimalCardProps } from './AnimalCard.mocks';

export default {
  title: 'cards/AnimalCard',
  component: AnimalCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AnimalCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AnimalCard> = (args) => (
  <AnimalCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAnimalCardProps.base,
} as IAnimalCard;
