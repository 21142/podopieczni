import { ComponentMeta, ComponentStory } from '@storybook/react';
import SearchResults, { ISearchResults } from './SearchResults';
import { mockSearchResultsProps } from './SearchResults.mocks';

export default {
  title: 'utils/SearchResults',
  component: SearchResults,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof SearchResults>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SearchResults> = (args) => (
  <SearchResults {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSearchResultsProps.base,
} as ISearchResults;
