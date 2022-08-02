import { ComponentMeta, ComponentStory } from '@storybook/react';
import GlobalStatistics, { IGlobalStatistics } from './GlobalStatistics';
import { mockGlobalStatisticsProps } from './GlobalStatistics.mocks';

export default {
  title: 'utils/GlobalStatistics',
  component: GlobalStatistics,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof GlobalStatistics>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof GlobalStatistics> = (args) => (
  <GlobalStatistics {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockGlobalStatisticsProps.base,
} as IGlobalStatistics;
