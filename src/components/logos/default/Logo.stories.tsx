import { ComponentMeta, ComponentStory } from '@storybook/react';
import Logo, { ILogo } from './Logo';
import { mockLogoProps } from './Logo.mocks';

export default {
  title: 'logos/Logo',
  component: Logo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Logo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Logo> = (args) => <Logo {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockLogoProps.base,
} as ILogo;
