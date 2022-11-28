import { Listbox } from '@headlessui/react';
import { useState } from 'react';

type Props = {
  value: string;
  initial: string;
  options: [{ id: string; value: string; disabled: boolean }];
};

const SelectInput = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState(props.initial);

  return (
    <Listbox
      value={selectedOption}
      onChange={setSelectedOption}
    >
      <Listbox.Button>{selectedOption}</Listbox.Button>
      <Listbox.Options>
        {props.options.map((option) => (
          <Listbox.Option
            key={option.id}
            value={option.value}
            disabled={option.disabled}
          >
            {option.value}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default SelectInput;
