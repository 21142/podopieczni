export interface IBaseComponentTemplate {
  sampleTextProp: string;
}

const BaseComponentTemplate: React.FC<IBaseComponentTemplate> = ({
  sampleTextProp,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-cyan-50">
      {sampleTextProp}
    </div>
  );
};

export default BaseComponentTemplate;
