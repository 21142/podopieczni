export interface IBaseComponentTemplate {
  sampleTextProp: string;
}

const BaseComponentTemplate: React.FC<IBaseComponentTemplate> = ({
  sampleTextProp,
}) => {
  return <div className=''>{sampleTextProp}</div>;
};

export default BaseComponentTemplate;
