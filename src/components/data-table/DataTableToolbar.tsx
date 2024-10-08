import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { links } from '~/config/siteConfig';
import { roles, species, statuses } from '~/lib/constants';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { DataTableFilter } from './DataTableFilter';
import { DataTableVisibilityOptions } from './DataTableVisibilityOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  variant?: 'animals' | 'users' | 'joinRequests' | 'adoptions';
}

export function DataTableToolbar<TData>({
  table,
  variant,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { t } = useTranslation('common');

  const redirectionLink =
    variant === 'animals' ? links.registerAnimal : links.registerUser;

  return (
    <div className="flex flex-1 flex-col items-center justify-between space-x-2 space-y-2 sm:flex-row sm:space-y-0">
      {variant !== 'joinRequests' && variant !== 'adoptions' && (
        <Input
          placeholder={t('animals_table_input_placeholder')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[200px] lg:w-[250px]"
        />
      )}
      {variant === 'adoptions' && (
        <div className="flex max-w-full gap-3">
          <Input
            placeholder={t('adoptions_table_name_input_placeholder')}
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[200px] lg:w-[250px]"
          />
          <Input
            placeholder={t('adoptions_table_email_input_placeholder')}
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('email')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[200px] lg:w-[250px]"
          />
        </div>
      )}
      {variant === 'joinRequests' && (
        <div className="flex max-w-full gap-3">
          <Input
            placeholder={t('join_requests_table_email_input_placeholder')}
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('email')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[200px] lg:w-[250px]"
          />
          <Input
            placeholder={t('join_requests_table_name_input_placeholder')}
            value={
              (table.getColumn('userName')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('userName')?.setFilterValue(event.target.value)
            }
            className="h-8 w-[200px] lg:w-[250px]"
          />
        </div>
      )}
      <div className="flex gap-2">
        {variant === 'animals' && (
          <div className="flex items-center gap-2">
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
                size="lg"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                {t('animals_table_reset_filters')}
                <Icons.close className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {variant === 'users' && (
          <div className="flex items-center gap-2">
            {table.getColumn('role') && (
              <DataTableFilter
                column={table.getColumn('role')}
                title={t('column_role')}
                options={roles}
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                {t('animals_table_reset_filters')}
                <Icons.close className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        <DataTableVisibilityOptions table={table} />
        {variant !== 'joinRequests' && variant !== 'adoptions' && (
          <Button
            onClick={() => router.push(redirectionLink)}
            variant="primary"
            size="sm"
          >
            <span className="flex items-center gap-1">
              <Icons.add className="h-4 w-4" />
              {t('animals_table_add_button')}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
