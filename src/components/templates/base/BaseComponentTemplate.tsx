import styles from './BaseComponentTemplate.module.css';

export interface IBaseComponentTemplate {
  sampleTextProp: string;
}

const BaseComponentTemplate: React.FC<IBaseComponentTemplate> = ({
  sampleTextProp,
}) => {
  return <div className={styles.container}>{sampleTextProp}</div>;
};

export default BaseComponentTemplate;
