import { ComponentMeta, ComponentStory } from '@storybook/react';
import HeaderLink, { IHeaderLink } from './HeaderLink';
import { mockHeaderLinkProps } from './HeaderLink.mocks';

export default {
  title: 'links/HeaderLink',
  component: HeaderLink,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof HeaderLink>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof HeaderLink> = (args) => (
  <HeaderLink {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockHeaderLinkProps.base,
} as IHeaderLink;
