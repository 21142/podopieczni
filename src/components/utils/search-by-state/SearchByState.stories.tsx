import { ComponentMeta, ComponentStory } from '@storybook/react';
import SearchByState, {
  ISearchByState
} from './SearchByState';
import { mockSearchByStateProps } from './SearchByState.mocks';

export default {
  title: 'utils/SearchByState',
  component: SearchByState,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SearchByState>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SearchByState> = (args) => (
  <SearchByState {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSearchByStateProps.base,
} as ISearchByState;
