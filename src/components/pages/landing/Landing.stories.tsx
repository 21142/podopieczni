import { ComponentMeta, ComponentStory } from '@storybook/react';
import Landing, { ILanding } from './Landing';
import { mockLandingProps } from './Landing.mocks';

export default {
  title: 'pages/Landing',
  component: Landing,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Landing>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Landing> = (args) => (
  <Landing {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockLandingProps.base,
} as ILanding;
