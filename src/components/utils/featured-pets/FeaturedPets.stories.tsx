import { ComponentMeta, ComponentStory } from '@storybook/react';
import FeaturedPets, { IFeaturedPets } from './FeaturedPets';
import { mockFeaturedPetsProps } from './FeaturedPets.mocks';

export default {
  title: 'utils/FeaturedPets',
  component: FeaturedPets,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof FeaturedPets>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeaturedPets> = (args) => (
  <FeaturedPets {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFeaturedPetsProps.base,
} as IFeaturedPets;
