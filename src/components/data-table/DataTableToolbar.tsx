import { type Table } from '@tanstack/react-table';
import { species, statuses } from '~/lib/constants';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { DataTableFilter } from './DataTableFilter';
import { DataTableVisibilityOptions } from './DataTableVisibilityOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search animals by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[200px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <DataTableFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('species') && (
          <DataTableFilter
            column={table.getColumn('species')}
            title="Species"
            options={species}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Icons.close className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableVisibilityOptions table={table} />
    </div>
  );
}
