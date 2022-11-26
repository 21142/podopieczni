type Props = {
  label: string;
  inputName: string;
  inputId: string;
  divStyles?: string;
  labelStyles?: string;
  inputStyles?: string;
  autoComplete?: string;
};

const TextInput = (props: Props) => {
  return (
    <div className={`relative z-0 min-w-[16rem] ${props.divStyles}`}>
      <input
        type="text"
        name={props.inputName}
        id={props.inputId}
        autoComplete={props.autoComplete ? props.autoComplete : ''}
        className={`autofill:border-blue peer mt-1 block h-14 w-full appearance-none rounded-[0.2rem] border-0 border-b-[3px] border-primary-400 bg-transparent px-1 pt-5 pb-0 text-neutral-800 outline-none duration-200 ease-out focus:border-primary-400/80 focus:outline-none focus:ring-0 sm:text-sm ${props.inputStyles}`}
        placeholder=" "
      />
      <label
        htmlFor={props.inputId}
        className={`align-center placeholder-opacity-20:text-neutral-800 absolute top-4 -z-10 h-14 w-full origin-[0] -translate-y-6 scale-75 transform cursor-text p-2 font-sans text-sm font-light tracking-[0.25rem] text-neutral-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-valid:text-primary-400 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-primary-400/80 ${props.labelStyles}`}
      >
        {props.label.toUpperCase()}
      </label>
    </div>
  );
};

export default TextInput;
