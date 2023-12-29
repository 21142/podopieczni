import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-1 flex-col items-center justify-between space-y-2 space-x-2 sm:flex-row sm:space-y-0">
      <Input
        placeholder={t('animals_table_input_placeholder')}
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
        className="h-8 w-[200px] lg:w-[250px]"
      />
      <div className="flex gap-2">
        {table.getColumn('status') && (
          <DataTableFilter
            column={table.getColumn('status')}
            title={t('animals_table_status_column')}
            options={statuses}
          />
        )}
        {table.getColumn('species') && (
          <DataTableFilter
            column={table.getColumn('species')}
            title={t('animals_table_species_column')}
            options={species}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {t('animals_table_reset_filters')}
            <Icons.close className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableVisibilityOptions table={table} />
        <Button
          onClick={() => void router.push('/animal/register')}
          variant="primary"
          size="sm"
        >
          <span className="flex items-center gap-1">
            <Icons.add className="h-4 w-4" />
            {t('animals_table_add_button')}
          </span>
        </Button>
      </div>
    </div>
  );
}
