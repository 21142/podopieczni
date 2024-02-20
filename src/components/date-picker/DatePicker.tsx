import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import { Calendar } from '../primitives/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/Popover';

export function DatePicker() {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <Icons.calendar className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
