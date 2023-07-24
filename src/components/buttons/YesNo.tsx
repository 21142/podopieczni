import { type FC } from 'react';
import { Icons } from '../icons/Icons';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

interface YesNoProps {
  question?: string;
}

const YesNo: FC<YesNoProps> = ({ question }) => {
  return (
    <div className="grid w-full">
      <Label className="text-sm font-medium text-foreground">{question}</Label>
      <ul className="grid w-full content-center justify-center gap-6 md:grid-cols-3">
        <li>
          <Input
            type="radio"
            id="yes"
            name="yesno"
            value="true"
            className="peer hidden"
            required
          />
          <Label
            htmlFor="yes"
            className="inline-flex h-[38px] w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-200 peer-checked:text-primary-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:peer-checked:text-primary-200"
          >
            <div className="block">
              <div className="text-md w-full font-medium">YES</div>
            </div>
            <Icons.check className="ml-3 h-5 w-5" />
          </Label>
        </li>
        <li>
          <Input
            type="radio"
            id="no"
            name="yesno"
            value="false"
            className="peer hidden"
          />
          <Label
            htmlFor="no"
            className="inline-flex h-[38px] w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-200 bg-white p-5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-600 peer-checked:border-primary-200 peer-checked:text-primary-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:peer-checked:text-primary-200"
          >
            <div className="block">
              <div className="text-md w-full font-medium">NO</div>
            </div>
            <Icons.close className="ml-3 h-5 w-5" />
          </Label>
        </li>
      </ul>
    </div>
  );
};

export default YesNo;
