import { ComponentMeta, ComponentStory } from '@storybook/react';
import SearchByBreed, {
  ISearchByBreed
} from './SearchByBreed';
import { mockSearchByBreedProps } from './SearchByBreed.mocks';

export default {
  title: 'utils/SearchByBreed',
  component: SearchByBreed,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SearchByBreed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SearchByBreed> = (args) => (
  <SearchByBreed {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSearchByBreedProps.base,
} as ISearchByBreed;
