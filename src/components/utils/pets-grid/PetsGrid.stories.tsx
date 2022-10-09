import { ComponentMeta, ComponentStory } from '@storybook/react';
import PetsGrid, { IPetsGrid } from './PetsGrid';

export default {
  title: 'grids/PetsGrid',
  component: PetsGrid,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {}
} as ComponentMeta<typeof PetsGrid>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PetsGrid> = (args) => (
  <PetsGrid {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {} as IPetsGrid;
