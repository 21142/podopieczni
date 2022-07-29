import { ComponentMeta, ComponentStory } from '@storybook/react';
import BaseComponentTemplate, {
  IBaseComponentTemplate,
} from './BaseComponentTemplate';
import { mockBaseComponentTemplateProps } from './BaseComponentTemplate.mocks';

export default {
  title: 'templates/BaseComponentTemplate',
  component: BaseComponentTemplate,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BaseComponentTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseComponentTemplate> = (args) => (
  <BaseComponentTemplate {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBaseComponentTemplateProps.base,
} as IBaseComponentTemplate;
